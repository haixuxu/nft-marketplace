import { Button, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { useForm } from 'react-hook-form';
import { useSendTicketMessage } from 'hooks';
import styles from './Ticket.module.scss';
import { getAirDropPayload } from 'utils/ticket';

type Values = { addressData: string; amount: string };

const defaultValues = { addressData: '', amount: '' };

function Ticket() {
  const { formState, control, register, handleSubmit, resetField, reset } = useForm<Values>({ defaultValues });
  const { errors } = formState;

  const alert = useAlert();
  const sendMessage = useSendTicketMessage();

  const resetForm = () => {
    reset();
  };

  const onSubmit = async (data: Values) => {
    const { addressData, amount } = data;

    try {
      if(/!\d+/.test(amount)){
        throw Error("must be number");
      }
      const list = addressData.split('|');
      const payload = getAirDropPayload(list, Number(amount));

      debugger;
      await sendMessage({ payload, onSuccess: resetForm });
    } catch (error) {
      alert.error((error as Error).message);
    }
  };

  return (
    <>
      <h2 className={styles.heading}>air drop nft ticket for addres list</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.item}>
            <Input label="Amount"  className={styles.input} {...register('amount', { required: 'amount is required' })} placeholder='airdrop amount to every address' />
            <p className={styles.error}>{errors.amount?.message}</p>
          </div>
          <div className={styles.item}>
            <Textarea label="Address" className={styles.textera} {...register('addressData', { required: 'address is required' })} placeholder="support format: address1|address2|address3" />
            <p className={styles.error}>{errors.addressData?.message}</p>
          </div>
            <div className={styles.btns}>
            <Button type="submit" text="Submit" className={styles.button}/>
            </div>
        </form>
      </div>
    </>
  );
}

export { Ticket };
