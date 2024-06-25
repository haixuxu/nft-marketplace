import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  const calcClass = ({ isActive }: any) => (isActive ? styles.active : '');
  return (
    <ul className={styles.menu}>
      <li>
        <NavLink to="/" className={calcClass}>
          NFT
        </NavLink>
      </li>
      <li>
        <NavLink to="/card_list" className={calcClass}>
          Model
        </NavLink>
      </li>
      <li>
        <NavLink to="/mint_ticket" className={calcClass}>
          Ticket
        </NavLink>
      </li>
      <li>
        <NavLink to="/playpage" className={calcClass}>
          Game
        </NavLink>
      </li>
    </ul>
  );
}

export { Menu };
