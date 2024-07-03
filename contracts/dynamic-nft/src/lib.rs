#![no_std]

use dynamic_nft_io::*;
use fungible_token_io::{FTAction, FTEvent};
use gear_lib_derive::{NFTCore, NFTMetaState, NFTStateKeeper};
use gear_lib_old::non_fungible_token::{io::NFTTransfer, nft_core::*, state::*, token::*};
use gstd::{
    collections::HashMap,
    exec,
    msg::{self},
    prelude::*,
    ActorId,
};
use player::*;
use primitive_types::{H256, U256};

mod player;

pub const ZERO_ID: ActorId = ActorId::zero();

include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

#[derive(Debug, Default, NFTStateKeeper, NFTCore, NFTMetaState)]
pub struct DynamicNft {
    #[NFTStateField]
    pub token: NFTState,
    pub token_id: TokenId,
    pub owner: ActorId,
    pub transactions: HashMap<H256, NFTEvent>,

    pub name: String,
    pub description: String,
    pub ref_admin: ActorId, // 
    pub ref_contract: ActorId, // ERC20, 
    pub dynamic_data: HashMap<TokenId, NftDynamicInfo>,
}

static mut CONTRACT: Option<DynamicNft> = None;

#[no_mangle]
unsafe extern "C" fn init() {
    let config: InitNFT = msg::load().expect("Unable to decode InitNFT");
    if config.royalties.is_some() {
        config.royalties.as_ref().expect("Unable to g").validate();
    }
    if config.ref_contract.is_zero() {
        panic!("NonFungibleToken: zero address, ref_contract");
    }
    if config.ref_admin.is_zero() {
        panic!("NonFungibleToken: zero address, ref_admin");
    }

    let nft = DynamicNft {
        token: NFTState {
            name: config.name.clone(),
            royalties: config.royalties,
            ..Default::default()
        },
        name: config.name,
        description: config.description,
        ref_admin: config.ref_admin,
        ref_contract: config.ref_contract,
        // config: config.config,
        owner: msg::source(),
        ..Default::default()
    };
    CONTRACT = Some(nft);
}

#[gstd::async_main]
async unsafe fn main() {
    let action: NFTAction = msg::load().expect("Could not load NFTAction");
    let nft = unsafe { CONTRACT.get_or_insert(Default::default()) };
    let reply = match action {
        NFTAction::Mint {
            transaction_id,
            token_metadata,
        } => {
            // nft.check_config();
            let source = msg::source();
            let contract_id = nft.ref_contract;
            msg::send_for_reply_as::<_, FTEvent>(
                contract_id,
                FTAction::BurnFrom {
                    from: source,
                    amount: 1,
                },
                0,
                0,
            )
            .expect("SEND MSG Error in async message to FT token contract")
            .await
            .expect("CALL RESP: Error transfer ft tokens");

            nft.process_transaction(transaction_id, |nft| {
                // TODO auto generate rarity

                NFTEvent::Transfer(MyNFTCore::mint(nft, token_metadata))
            })
        }
        NFTAction::Burn {
            transaction_id,
            token_id,
        } => nft.process_transaction(transaction_id, |nft| {
            NFTEvent::Transfer(NFTCore::burn(nft, token_id))
        }),
        NFTAction::Transfer {
            transaction_id,
            to,
            token_id,
        } => nft.process_transaction(transaction_id, |nft| {
            NFTEvent::Transfer(NFTCore::transfer(nft, &to, token_id))
        }),
        NFTAction::TransferPayout {
            transaction_id,
            to,
            token_id,
            amount,
        } => nft.process_transaction(transaction_id, |nft| {
            NFTEvent::TransferPayout(NFTCore::transfer_payout(nft, &to, token_id, amount))
        }),
        NFTAction::NFTPayout { owner, amount } => {
            NFTEvent::NFTPayout(NFTCore::nft_payout(nft, &owner, amount))
        }
        NFTAction::Approve {
            transaction_id,
            to,
            token_id,
        } => nft.process_transaction(transaction_id, |nft| {
            NFTEvent::Approval(NFTCore::approve(nft, &to, token_id))
        }),
        NFTAction::Owner { token_id } => NFTEvent::Owner {
            owner: NFTCore::owner_of(nft, token_id),
            token_id,
        },
        NFTAction::IsApproved { to, token_id } => NFTEvent::IsApproved {
            to,
            token_id,
            approved: NFTCore::is_approved_to(nft, &to, token_id),
        },
        NFTAction::DelegatedApprove {
            transaction_id,
            message,
            signature,
        } => nft.process_transaction(transaction_id, |nft| {
            NFTEvent::Approval(NFTCore::delegated_approve(nft, message, signature))
        }),
        NFTAction::Clear { transaction_hash } => {
            let source = msg::source();
            nft.clear(transaction_hash);
            NFTEvent::Clear { operator: source }
        }
        // NFTAction::AddMinter {
        //     transaction_id,
        //     minter_id,
        // } => {
        //     nft.check_config();
        //     nft.process_transaction(transaction_id, |nft| {
        //         nft.config.authorized_minters.push(minter_id);
        //         NFTEvent::MinterAdded { minter_id }
        //     })
        // }
        NFTAction::SetContract { contract_id } => {
            let source = msg::source();
            if source.eq(&nft.ref_admin) {
                nft.ref_contract = contract_id;
                NFTEvent::SetContractOK { contract_id }
            } else {
                panic!("Only can excute with admin!");
            }
        }
        NFTAction::Upgrade { token_id } => {
            // TODO 1. burn erc20 token 2. self NFT can upgrade
            // msg:source
            let nft_ext_info = nft
                .dynamic_data
                .get_mut(&token_id)
                .expect("token_id is invalid");
            update_nft_dynamic_info(nft_ext_info);
            NFTEvent::Upgraded {
                data: nft_ext_info.clone(),
            }
        } // NFTAction::UpdateDynamicData {
          //     transaction_id,
          //     data,
          // } => nft.process_transaction(transaction_id, |nft| {
          //     let data_hash = H256::from(sp_core_hashing::blake2_256(&data));
          //     nft.dynamic_data = data;

          //     NFTEvent::Updated { data_hash }
          // }),
    };
    msg::reply(reply, 0).expect("Failed to encode or reply with `Result<NftEvent, NftError>`.");
}

pub trait MyNFTCore: NFTCore {
    fn mint(&mut self, token_metadata: TokenMetadata) -> NFTTransfer;
}

impl MyNFTCore for DynamicNft {
    fn mint(&mut self, token_metadata: TokenMetadata) -> NFTTransfer {
        let transfer = NFTCore::mint(self, &msg::source(), self.token_id, Some(token_metadata));
        self.dynamic_data
            .insert(self.token_id, generate_random_nft_dynamic_info());
        self.token_id = self.token_id.saturating_add(U256::one());
        transfer
    }
}

impl DynamicNft {
    fn process_transaction(
        &mut self,
        transaction_id: u64,
        action: impl FnOnce(&mut DynamicNft) -> NFTEvent,
    ) -> NFTEvent {
        let transaction_hash = get_hash(&msg::source(), transaction_id);

        if let Some(nft_event) = self.transactions.get(&transaction_hash) {
            nft_event.clone()
        } else {
            let nft_event: NFTEvent = action(self);

            self.transactions
                .insert(transaction_hash, nft_event.clone());

            nft_event
        }
    }

    fn clear(&mut self, transaction_hash: H256) {
        assert_eq!(
            msg::source(),
            exec::program_id(),
            "Not allowed to clear transactions"
        );
        self.transactions.remove(&transaction_hash);
    }
    // fn check_config(&self) {
    //     if let Some(max_mint_count) = self.config.max_mint_count {
    //         if max_mint_count <= self.token.token_metadata_by_id.len() as u32 {
    //             panic!(
    //                 "Mint impossible because max minting count {} limit exceeded",
    //                 max_mint_count
    //             );
    //         }
    //     }

    //     let current_minter = msg::source();
    //     let is_authorized_minter = self
    //         .config
    //         .authorized_minters
    //         .iter()
    //         .any(|authorized_minter| authorized_minter.eq(&current_minter));

    //     if !is_authorized_minter {
    //         panic!(
    //             "Current minter {:?} is not authorized at initialization",
    //             current_minter
    //         );
    //     }
    // }
}

#[no_mangle]
extern "C" fn state() {
    let contract = unsafe { CONTRACT.take().expect("Unexpected error in taking state") };
    msg::reply::<IoNFT>(contract.into(), 0)
        .expect("Failed to encode or reply with `IoNFT` from `state()`");
}

pub fn get_hash(account: &ActorId, transaction_id: u64) -> H256 {
    let account: [u8; 32] = (*account).into();
    let transaction_id = transaction_id.to_be_bytes();
    sp_core_hashing::blake2_256(&[account.as_slice(), transaction_id.as_slice()].concat()).into()
}

impl From<DynamicNft> for IoNFT {
    fn from(value: DynamicNft) -> Self {
        let DynamicNft {
            token,
            token_id,
            owner,
            transactions,
            ref_contract,
            dynamic_data,
            ..
        } = value;

        let transactions = transactions
            .iter()
            .map(|(key, event)| (*key, event.clone()))
            .collect();

        let dynamic_data = dynamic_data
            .iter()
            .map(|(key, info)| (*key, info.clone()))
            .collect();

        Self {
            token: (&token).into(),
            token_id,
            owner,
            transactions,
            ref_contract,
            dynamic_data,
        }
    }
}
