import { Button, Input} from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { useForm } from 'react-hook-form';
import { useSendNFTMessage } from 'hooks';
import { getAddMintPayload } from 'utils';
import styles from './AddMinter.module.scss';

type Values = { address: string;};

const defaultValues = { address: '' };


function AddMinter() {
  const { formState, register, handleSubmit, reset } = useForm<Values>({ defaultValues });
  const { errors } = formState;

  const alert = useAlert();
  const sendMessage = useSendNFTMessage();

  const resetForm = () => {
    reset();
  };

  const onSubmit = async (data: Values) => {
    const { address } = data;

    try {

      const payload = getAddMintPayload(address);
      await sendMessage({ payload, onSuccess: resetForm });
    } catch (error) {
      alert.error((error as Error).message);
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Add minter for NFT</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.item}>
            <Input label="Address" className={styles.input} {...register('address', { required: 'address is required' })}  placeholder='wallet address'/>
            <p className={styles.error}>{errors.address?.message}</p>
          </div>
          <Button type="submit" text="Add" className={styles.button} block />
        </form>
      </div>
    </>
  );
}

export { AddMinter };
