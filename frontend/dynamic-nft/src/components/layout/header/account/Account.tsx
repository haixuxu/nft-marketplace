import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import userSVG from 'assets/images/icons/login.svg';
import { Button } from '@gear-js/ui';
import { AccountsModal } from './accounts-modal';
import { Wallet } from './wallet';

function Account() {
  const { account,logout } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {account ? (
          <div className="accountinfo">
             <Wallet address={account.address} name={account.meta.name} onClick={openModal} />
          </div>
      ) : (
        <Button icon={userSVG} text="Sign in" onClick={openModal} />
      )}
      {isModalOpen && <AccountsModal close={closeModal} />}
    </>
  );
}

export { Account };
