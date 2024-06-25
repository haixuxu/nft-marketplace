import { Card } from '../card';
import styles from './Attributes.module.scss';

type Props = {
  attributes: { [key: string]: string };
};

function Attributes({ attributes }: Props) {
  const getAttributes = () =>
    Object.keys(attributes).map((attribute) => (
      <li key={attribute} className={styles.attritem}>
        {attribute}: {attributes[attribute]}
      </li>
    ));

    

  return (
    <Card heading="Attributes">
      <ul>{getAttributes()}</ul>
    </Card>
  );
}

export { Attributes };
