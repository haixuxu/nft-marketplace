import { useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { AccountButton } from './account-button';
import styles from './Wallet.module.scss';
import { useTicketBalance, useTicketName } from 'hooks/ticket';
import { Button } from '@gear-js/ui';

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function Wallet({ address, name, onClick }: Props) {
  const { balance } = useBalance(address);
  const { logout } = useAccount();
  const ticketInfo = useTicketName();
  const ticketBalance = useTicketBalance();
  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  return (
    <div className={styles.wallet}>
      <p className={styles.balance}>
        {ticketBalance}
        <span className={styles.currency}>{'/' + ticketInfo.name}</span>
      </p>
      <p className={styles.balance}>
        {formattedBalance?.value}
        <span className={styles.currency}>{'/' + formattedBalance?.unit}</span>
      </p>
      <AccountButton address={address} name={name} onClick={onClick} />
      <Button className={styles.logout} text="LogOut" onClick={() => logout()} />
    </div>
  );
}

export { Wallet };
