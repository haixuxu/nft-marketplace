import { Button, Checkbox, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import plus from 'assets/images/form/plus.svg';
import { useSendNFTMessage, useSendTicketMessage } from 'hooks';
import { getMintDetails, getMintPayload, ipfsCrustPins, ipfsUpload, stringToFile } from 'utils';
import { Attributes } from 'components';
import styles from './CreateForm.module.scss';
import { ImageItem } from 'types';

type AttributesValue = { key: string; value: string };
type Values = { name: string; description: string; image: FileList; attributes: AttributesValue[]; rarity: string };

const defaultAttributes = [{ key: '', value: '' }];
const defaultValues = { name: '', description: '', attributes: defaultAttributes, rarity: '' };

const IMAGE_FILE_TYPES = ['image/png', 'image/gif', 'image/jpeg'];

const validateImage = {
  required: (files: FileList) => !!files.length || 'Attach image',
  size: (files: FileList) => files[0].size / 1024 ** 2 < 10 || 'Image size should not exceed 10MB',
  extension: (files: FileList) => IMAGE_FILE_TYPES.includes(files[0].type) || 'Image should be .jpg, .png or .gif',
};

function CreateForm() {
  const { formState, control, register, handleSubmit, resetField, reset } = useForm<Values>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' });
  const { errors } = formState;

  const alert = useAlert();
  const sendMessage = useSendNFTMessage();
  const sendTicketMsg = useSendTicketMessage();
  const [cimage, setImageItem] = useState<ImageItem>({ link: '', name: '', desc: '' });

  const [isAnyAttribute, setIsAnyAttribute] = useState(false);
  const [isRarity, setIsRarity] = useState(false);

  const toggleAttributes = () => setIsAnyAttribute((prevValue) => !prevValue);
  const toggleRarity = () => setIsRarity((prevValue) => !prevValue);

  useEffect(() => {
    resetField('attributes');
    try {
      setImageItem(JSON.parse(localStorage.getItem('chooseModel') as string));
    } catch (error) {
      alert.error('please select NFT Model');
    }
  }, [isAnyAttribute, resetField]);

  useEffect(() => {
    resetField('rarity');
  }, [isRarity, resetField]);

  const triggerImageChange = () => {
    // hacky fix cuz reset() doesn't trigger file input's onChange
    const changeEvent = new Event('change', { bubbles: true });
    document.querySelector('[name="image"]')?.dispatchEvent(changeEvent);
  };

  const resetForm = () => {
    reset();
    triggerImageChange();
    setIsAnyAttribute(false);
    setIsRarity(false);
  };

  const onSubmit = async (data: Values) => {
    const { name, description, attributes, rarity } = data;
    // const image = data.image[0];

    try {
      const details = isAnyAttribute || isRarity ? getMintDetails(isAnyAttribute ? attributes : undefined, rarity) : '';
      // const { Hash } = await ipfsUpload(image);
      // await ipfsCrustPins(Hash);

      let detailsCid = '';
      if (details) {
        const txtfile = stringToFile(details, 'detail.txt', 'plain/text');
        const ret2 = await ipfsUpload(txtfile);
        await ipfsCrustPins(ret2.Hash);
        detailsCid = ret2.Hash;
      }
      const payload = getMintPayload(name, description, cimage.link.replace(/^.*\//, ''), detailsCid ? detailsCid : '');
      await sendMessage({ payload, onSuccess: resetForm });
    } catch (error) {
      alert.error((error as Error).message);
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Create NFT, tips: 需要HAI代币</h2>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.item}>
            <Input label="Name" className={styles.input} {...register('name', { required: 'Name is required' })} />
            <p className={styles.error}>{errors.name?.message}</p>
          </div>

          <div className={styles.item}>
            <Textarea label="Description" className={styles.input} {...register('description', { required: 'Description is required' })} />
            <p className={styles.error}>{errors.description?.message}</p>
          </div>

          <div className={clsx(styles.input, styles.checkboxWrapper)}>
            <div className={styles.item}>
              <Checkbox label="Attributes" checked={isAnyAttribute} onChange={toggleAttributes} />
              {isAnyAttribute && <Button icon={plus} color="transparent" onClick={() => append(defaultAttributes)} />}
              <p className={clsx(styles.error, styles.checkboxError)}>{(errors.attributes?.[0]?.key || errors.attributes?.[0]?.value) && 'Enter attributes'}</p>
            </div>
          </div>
          {isAnyAttribute && <Attributes register={register} fields={fields} onRemoveButtonClick={remove} />}

          <div className={clsx(styles.input, styles.checkboxWrapper)}>
            <div className={styles.item}>
              <Checkbox label="Rarity" checked={isRarity} onChange={toggleRarity} />
              <p className={clsx(styles.error, styles.checkboxError)}>{errors.rarity?.message}</p>
            </div>
          </div>
          {isRarity && (
            <div className={styles.item}>
              <Input label="Rarity" className={styles.input} {...register('rarity', { required: 'Enter rarity' })} />
            </div>
          )}

          <div className={styles.item}>
            {/* <FileInput label="Image" className={styles.input} accept={IMAGE_FILE_TYPES.join(', ')} {...register('image', { validate: validateImage })} />
            <p className={styles.error}>{errors.image?.message}</p> */}
          </div>
          <div className={styles.btns}>
            <Button type="submit" text="Submit" className={styles.button} />
          </div>
        </form>
        <div className={styles.nftimg}>
          <img src={cimage.link} className={styles.nftimg} />
        </div>
      </div>
    </>
  );
}

export { CreateForm };
