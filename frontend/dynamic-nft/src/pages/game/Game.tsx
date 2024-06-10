import { useAlert } from '@gear-js/react-hooks';
import { useForm } from 'react-hook-form';
import { useSendTicketMessage } from 'hooks';
import styles from './Game.module.scss';

type Values = { addressData: string; amount: string };

const defaultValues = { addressData: '', amount: '' };

function GameBox() {
  const { formState, control, register, handleSubmit, resetField, reset } = useForm<Values>({ defaultValues });
  const { errors } = formState;

  const alert = useAlert();
  const sendMessage = useSendTicketMessage();

  const resetForm = () => {
    reset();
  };

  const start = ()=>{
     // TODO
  }

  return (
    <>
      <h2 className={styles.heading}>play game</h2>
      <div className={styles.main}>
          <p> sorry , await to implement!</p>
      </div>
    </>
  );
}

export { GameBox };
