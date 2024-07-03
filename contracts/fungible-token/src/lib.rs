#![no_std]

use fungible_token_io::*;
use gstd::{
    collections::HashMap, errors::Result as GstdResult, msg, prelude::*, ActorId, MessageId,
};
use ops::Mul;

#[cfg(test)]
mod tests;

const ZERO_ID: ActorId = ActorId::new([0u8; 32]);

#[derive(Debug, Clone, Default)]
struct FungibleToken {
    /// Name of the token.
    name: String,
    /// Symbol of the token.
    symbol: String,
    /// Total supply of the token.
    total_supply: u128,
    /// Map to hold balances of token holders.
    balances: HashMap<ActorId, u128>,
    /// Map to hold allowance information of token holders.
    allowances: HashMap<ActorId, HashMap<ActorId, u128>>,
    /// Token's decimals.
    pub decimals: u8,
    pub authorized_minters: Vec<ActorId>,
}

static mut FUNGIBLE_TOKEN: Option<FungibleToken> = None;

impl FungibleToken {
    /// Executed on receiving `fungible-token-messages::MintInput`.
    fn mint(&mut self, amount: u128) {
        self.check_config();
        let source = msg::source();
        self.balances
            .entry(source)
            .and_modify(|balance| *balance += amount)
            .or_insert(amount);
        self.total_supply += amount;
        msg::reply(
            FTEvent::Transfer {
                from: ZERO_ID,
                to: source,
                amount,
            },
            0,
        )
        .unwrap();
    }
    fn airdrop(&mut self, recipients: Vec<ActorId>, amount: u128) {
        self.check_config();
        let source = msg::source();
        if recipients.len() == 0 {
            panic!("air drop recipients is must be have one element")
        }
        if amount == 0 {
            panic!("airdrop amount is must be lg zero")
        }
        if !self.can_transfer(&source, amount.mul(recipients.len() as u128)) {
            panic!("balance is not enough for airdrop!")
        }
        for target in recipients.iter() {
            self.transfer(&source, target, amount, true)
        }
        msg::reply(FTEvent::AirDrop { recipients, amount }, 0).unwrap();
    }
    fn burn_from(&mut self, from:ActorId, amount: u128) {
        self.check_config();
        if self.balances.get(&from).unwrap_or(&0) < &amount {
            panic!("Amount exceeds account balance");
        }
        self.balances
            .entry(from)
            .and_modify(|balance| *balance -= amount);
        self.total_supply -= amount;

        msg::reply(
            FTEvent::BurnFrom {
                from: from,
                amount,
            },
            0,
        )
        .unwrap();
    }

    /// Executed on receiving `fungible-token-messages::BurnInput`.
    fn burn(&mut self, amount: u128) {
        self.check_config();
        let source = msg::source();
        if self.balances.get(&source).unwrap_or(&0) < &amount {
            panic!("Amount exceeds account balance");
        }
        self.balances
            .entry(source)
            .and_modify(|balance| *balance -= amount);
        self.total_supply -= amount;

        msg::reply(
            FTEvent::Transfer {
                from: source,
                to: ZERO_ID,
                amount,
            },
            0,
        )
        .unwrap();
    }
    /// Executed on receiving `fungible-token-messages::TransferInput` or `fungible-token-messages::TransferFromInput`.
    /// Transfers `amount` tokens from `sender` account to `recipient` account.
    fn transfer(&mut self, from: &ActorId, to: &ActorId, amount: u128, is_drop: bool) {
        if from == &ZERO_ID || to == &ZERO_ID {
            panic!("Zero addresses");
        };
        if !self.can_transfer(from, amount) {
            panic!("Not allowed to transfer")
        }
        if self.balances.get(from).unwrap_or(&0) < &amount {
            panic!("Amount exceeds account balance");
        }
        self.balances
            .entry(*from)
            .and_modify(|balance| *balance -= amount);
        self.balances
            .entry(*to)
            .and_modify(|balance| *balance += amount)
            .or_insert(amount);
        if is_drop == false {
            msg::reply(
                FTEvent::Transfer {
                    from: *from,
                    to: *to,
                    amount,
                },
                0,
            )
            .unwrap();
        }
    }

    /// Executed on receiving `fungible-token-messages::ApproveInput`.
    fn approve(&mut self, to: &ActorId, amount: u128) {
        if to.is_zero() {
            panic!("Approve to zero address");
        }
        let source = msg::source();
        if to.eq(&source) {
            panic!("Approve for source is invalid!");
        }
        self.allowances
            .entry(source)
            .or_default()
            .insert(*to, amount);
        msg::reply(
            FTEvent::Approve {
                from: source,
                to: *to,
                amount,
            },
            0,
        )
        .unwrap();
    }

    fn can_transfer(&mut self, from: &ActorId, amount: u128) -> bool {
        let source = msg::source();
        if from == &source && self.balances.get(&source).unwrap_or(&0) >= &amount {
            return true;
        }
        if let Some(allowed_amount) = self.allowances.get(from).and_then(|m| m.get(&source)) {
            if allowed_amount >= &amount {
                self.allowances.entry(*from).and_modify(|m| {
                    m.entry(source).and_modify(|a| *a -= amount);
                });
                return true;
            }
        }
        false
    }
    fn check_config(&self) {
        let current_minter = msg::source();
        let is_authorized_minter = self
            .authorized_minters
            .iter()
            .any(|authorized_minter| authorized_minter.eq(&current_minter));

        if !is_authorized_minter {
            panic!(
                "Current minter {:?} is not authorized at initialization",
                current_minter
            );
        }
    }
}

fn common_state() -> IoFungibleToken {
    let state = static_mut_state();
    let FungibleToken {
        name,
        symbol,
        total_supply,
        balances,
        allowances,
        decimals,
        authorized_minters,
    } = state.clone();

    let balances = balances.iter().map(|(k, v)| (*k, *v)).collect();
    let allowances = allowances
        .iter()
        .map(|(id, allowance)| (*id, allowance.iter().map(|(k, v)| (*k, *v)).collect()))
        .collect();
    IoFungibleToken {
        name,
        symbol,
        total_supply,
        balances,
        allowances,
        decimals,
        authorized_minters
    }
}

fn static_mut_state() -> &'static mut FungibleToken {
    unsafe { FUNGIBLE_TOKEN.get_or_insert(Default::default()) }
}

#[no_mangle]
extern "C" fn state() {
    reply(common_state())
        .expect("Failed to encode or reply with `<AppMetadata as Metadata>::State` from `state()`");
}

fn reply(payload: impl Encode) -> GstdResult<MessageId> {
    Ok(msg::reply(payload, 0)?)
}

#[no_mangle]
extern "C" fn handle() {
    let action: FTAction = msg::load().expect("Could not load Action");
    let ft: &mut FungibleToken = unsafe { FUNGIBLE_TOKEN.get_or_insert(Default::default()) };
    match action {
        FTAction::Mint(amount) => ft.mint(amount),
        FTAction::AirDrop { recipients, amount } => ft.airdrop(recipients, amount),
        FTAction::Burn(amount) => ft.burn(amount),
        FTAction::BurnFrom { from, amount }=> ft.burn_from(from, amount),
        FTAction::Transfer { from, to, amount } => ft.transfer(&from, &to, amount, false),
        FTAction::Approve { to, amount } => ft.approve(&to, amount),
        FTAction::TotalSupply => {
            msg::reply(FTEvent::TotalSupply(ft.total_supply), 0).unwrap();
        }
        FTAction::BalanceOf(account) => {
            let balance = ft.balances.get(&account).unwrap_or(&0);
            msg::reply(FTEvent::Balance(*balance), 0).unwrap();
        }
        FTAction::AddMinter { minter_id } => {
            ft.check_config();
            ft.authorized_minters.push(minter_id);

            msg::reply(FTEvent::MinterAdded { minter_id }, 0)
                .expect("Error during replying with `NFTEvent::Approval`");
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let config: InitConfig = msg::load().expect("Unable to decode InitConfig");
    if config.authorized_minters.len() == 0 {
        panic!("Init authorized_minters is required");
    }
    let ft = FungibleToken {
        name: config.name,
        symbol: config.symbol,
        decimals: config.decimals,
        authorized_minters: config.authorized_minters,
        ..Default::default()
    };
    unsafe { FUNGIBLE_TOKEN = Some(ft) };
}

#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum State {
    Name,
    Symbol,
    Decimals,
    TotalSupply,
    BalanceOf(ActorId),
}

#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum StateReply {
    Name(String),
    Symbol(String),
    Decimals(u8),
    TotalSupply(u128),
    Balance(u128),
}
