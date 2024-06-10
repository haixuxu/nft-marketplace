import { useAccountDeriveBalancesAll, useApi, useBalanceFormat } from '@gear-js/react-hooks';
import cx from 'clsx';


import styles from './balance.module.scss';
import { useTicketBalance, useTicketName } from 'hooks';

const Balance = () => {
  const { isApiReady } = useApi();
  const ticketInfo = useTicketName();
  const ticketBalance = useTicketBalance();
  const balances = useAccountDeriveBalancesAll();
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = isApiReady && balances ? getFormattedBalance(balances.freeBalance) : undefined;

  return formattedBalance ? (
    <section className={styles.balanceSection}>
      {/* <h2 className={styles.title}>Balance:</h2> */}
      <p className={styles.content}>
        <span className={cx(styles.value, styles.value)}>{ticketBalance}</span>/
        <span className={styles.unit}>{ticketInfo.name}</span>
      </p>
      <p>&nbsp;&nbsp;</p>
      <p className={styles.content}>
        <span className={cx(styles.value, styles.value)}>{formattedBalance.value}</span>/
        <span className={styles.unit}>{formattedBalance.unit}</span>
      </p>
    </section>
  ) : null;
};

export { Balance };
