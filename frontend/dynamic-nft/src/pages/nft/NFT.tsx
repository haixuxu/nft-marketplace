import { useEffect, useState } from 'react';
import { TokenDetails, Attributes } from 'types';
import { getIpfsAddress } from 'utils';
import { ConfirmationModal, AddressModal, Loader } from 'components';
import { HexString } from '@polkadot/util/types';
import { useNFT, useSendNFTMessage } from 'hooks';
import { Content } from './content';
import { base64ToUtf8 } from 'utils/encode';

function NFT() {
  const nft = useNFT();
  const { id, reference } = nft || {};

  const sendMessage = useSendNFTMessage();

  const [attrs, setDetails] = useState<Attributes>();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [revokedAddress, setRevokedAddress] = useState('' as HexString);
  const rarity = '1';
  useEffect(() => {
    if (reference) {
      try {
        const realstr = base64ToUtf8(reference);
        setDetails(JSON.parse(realstr));
      } catch (error) {
        console.log(error);
      }
      // fetch(getIpfsAddress(reference))
      //   .then((response) => response.json())
      //   .then(setDetails);
    }
  }, [reference]);

  const openTransferModal = () => setIsTransferModalOpen(true);
  const openApproveModal = () => setIsApproveModalOpen(true);
  const openRevokeModal = (address: HexString) => setRevokedAddress(address);

  const closeModal = () => {
    setIsTransferModalOpen(false);
    setIsApproveModalOpen(false);
    setRevokedAddress('' as HexString);
  };

  const onSuccess = closeModal;

  const transfer = (address: HexString) => sendMessage({ payload: { Transfer: { to: address, tokenId: id } }, onSuccess });
  const approve = (address: HexString) => sendMessage({ payload: { Approve: { to: address, tokenId: id } }, onSuccess });
  const revoke = () => sendMessage({ payload: { RevokeApproval: { approvedAccount: revokedAddress, tokenId: id } }, onSuccess });

  const startPlay = () => {
    sendMessage({ payload: { UpdateDynamicData: { approvedAccount: revokedAddress, tokenId: id } }, onSuccess });
  };

  return (
    <>
      {nft ? (
        <Content
          heading={`${nft.name} #${nft.id}`}
          image={getIpfsAddress(nft.media)}
          ownerId={nft.ownerId}
          description={nft.description}
          approvedAccounts={nft.approvedAccountIds}
          rarity={rarity}
          attributes={attrs}
          onTransferButtonClick={openTransferModal}
          onApproveButtonClick={openApproveModal}
          onRevokeButtonClick={openRevokeModal}
          onPlayGameButtonClick={startPlay}
        />
      ) : (
        <Loader />
      )}
      {isTransferModalOpen && <AddressModal heading="Transfer token" close={closeModal} onSubmit={transfer} />}
      {isApproveModalOpen && <AddressModal heading="Approve token" close={closeModal} onSubmit={approve} />}
      {revokedAddress && <ConfirmationModal heading="Revoke approval?" close={closeModal} onSubmit={revoke} />}
    </>
  );
}

export { NFT };
