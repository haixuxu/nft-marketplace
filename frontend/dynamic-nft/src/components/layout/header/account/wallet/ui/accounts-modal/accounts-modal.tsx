import { decodeAddress } from '@gear-js/api';
import { AlertContainerFactory, useAccount, useAlert } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import { Modal } from 'components';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import cx from 'clsx';

import logoutsvg from '../../assets/logout.svg';
import copykeysvg from '../../assets/copyKey.svg';

import { AccountButton } from '../account-button';
import { useWallet } from '../../hooks';
import { WALLETS } from '../../consts';
import styles from './accounts-modal.module.scss';

const copyToClipboard = async (key: string, alert: AlertContainerFactory, successfulText?: string) => {
  try {
    await navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};

type Props = {
  close: () => void;
};

const AccountsModal = ({ close }: Props) => {
  const { account, extensions, login, logout } = useAccount();

  const alert = useAlert();

  const { wallet, walletAccounts, setWalletId, resetWalletId, getWalletAccounts } = useWallet();

  const handleLogoutClick = () => {
    logout();
    close();
  };

  const handleAccountClick = (newAccount: InjectedAccountWithMeta) => {
    login(newAccount);
    close();
  };

  const modalClassName = cx(styles.modal, !isWeb3Injected && styles.empty);
  const heading = wallet ? 'Connect account' : 'Choose Wallet';

  const getWallets = () =>
    WALLETS.map(([id, { svgicon, name }]) => {
      const isEnabled = extensions?.some((extension) => extension.name === id);

      const accountsCount = getWalletAccounts(id)?.length;
      const accountsStatus = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      const buttonClassName = cx(buttonStyles.button, buttonStyles.large, buttonStyles.block, styles.button, isEnabled && styles.enabled);

      return (
        <li key={id} className={styles.listitem}>
          <button type="button" className={buttonClassName} onClick={() => setWalletId(id)}>
            <span>
              <img src={svgicon} alt="" /> {name}
            </span>

            <div className={styles.status}>
              <p className={styles.statusText}>{isEnabled ? 'Enabled' : 'Disabled'}</p>

              {isEnabled && <p className={styles.statusAccounts}>{accountsStatus}</p>}
            </div>
          </button>
        </li>
      );
    });

  const getAccounts = () =>
    walletAccounts?.map((_account) => {
      const { address, meta } = _account;
      const isActive = address === account?.address;

      const handleClick = () => {
        if (isActive) return;
        handleAccountClick(_account);
      };

      const handleCopy = () => {
        const decodedAddress = decodeAddress(address);
        copyToClipboard(decodedAddress, alert);
      };

      const accountBtnClasses = cx(buttonStyles.large, styles.accountButton, isActive ? styles.active : buttonStyles.light);

      return (
        <li key={address} className={styles.accountItem}>
          <AccountButton name={meta.name} address={address} className={accountBtnClasses} onClick={handleClick} />
          <Button icon={copykeysvg} color="transparent" onClick={handleCopy} />
        </li>
      );
    });

  return (
    <Modal heading={heading} close={close} className={modalClassName} modalClass="modalbox">
      {isWeb3Injected ? (
        <>
          <div className={styles.simplebar}>
            {!wallet && <ul className={styles.list}>{getWallets()}</ul>}

            {!!wallet &&
              (walletAccounts?.length ? (
                <ul className={styles.list}>{getAccounts()}</ul>
              ) : (
                <p>No accounts found. Please open your Polkadot extension and create a new account or import existing. Then reload this page.</p>
              ))}
          </div>

          <footer className={styles.footer}>
            {wallet && <Button icon={wallet.svgicon} text={wallet.name} color="transparent" onClick={resetWalletId} />}

            <Button icon={logoutsvg} text="Logout" color="transparent" className={styles.logoutButton} onClick={handleLogoutClick} />
          </footer>
        </>
      ) : (
        <p>
          Wallet extension was not found or disconnected. Please check how to install a supported wallet and create an account{' '}
          <a href="https://wiki.gear-tech.io/docs/idea/account/create-account" target="_blank" rel="noreferrer" className="link-text">
            here
          </a>
          .
        </p>
      )}
    </Modal>
  );
};

export { AccountsModal };
