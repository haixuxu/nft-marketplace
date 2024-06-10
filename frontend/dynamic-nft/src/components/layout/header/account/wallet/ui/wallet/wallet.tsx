import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import cx from 'clsx';
import { useState } from 'react';

// import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import subwalletsvg from '../../assets/subwallet.svg';

import { AccountsModal } from '../accounts-modal';
import { AccountButton } from '../account-button';
import { Balance } from '../balance';
import styles from './wallet.module.scss';

const Wallet = () => {
  const { account, isAccountReady } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.wallet}>
        <Balance />

        {isAccountReady &&
          (account ? (
            <AccountButton
              name={account.meta.name}
              address={account.address}
              className={cx(buttonStyles.medium, styles.accountBtn)}
              onClick={openModal}
            />
          ) : (
            <div className={styles.onboardingTooltip}>
              <Button icon={subwalletsvg} text="Connect" color="primary" onClick={openModal} />
            </div>
          ))}
      </div>

      {isModalOpen && <AccountsModal close={closeModal} />}
    </>
  );
};

export { Wallet };
