import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';

function Menu() {
  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/addminter">Add Minter</Link>
      </li>
      <li>
        <Link to="/create">Create NFT</Link>
      </li>
    </ul>
  );
}

export { Menu };
