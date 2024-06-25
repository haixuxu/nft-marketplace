import { useAccount } from '@gear-js/react-hooks';
import { Logo } from './logo';
import { Menu } from './menu';
import { Account } from './account';
import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  const { account } = useAccount();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {account && <Menu />}
      </nav>
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
