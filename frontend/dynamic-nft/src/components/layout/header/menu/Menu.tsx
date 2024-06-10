import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/card_list">NFT Model</Link>
      </li> <li>
        <Link to="/create">Create NFT</Link>
      </li>
      <li>
        <Link to="/mint_ticket">AirDrop NFT Ticket</Link>
      </li>
    </ul>
  );
}

export { Menu };
