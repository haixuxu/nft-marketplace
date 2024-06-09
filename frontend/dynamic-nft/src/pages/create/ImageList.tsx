import { useEffect, useRef, useState } from 'react';
import styles from './ImageList.module.scss';
import { ImageItem } from 'types';
import { useAlert } from '@gear-js/react-hooks';
import {Img} from 'components';

type Props = {
  onChoose: (value: ImageItem) => void;
};

function ImageList({ onChoose }: Props) {
  let [ImageItems, setImageItem] = useState<Array<ImageItem>>([]);
  const alert = useAlert();

  const getImageList = () =>
    ImageItems.map((item,index) => (
      <li key={index}>
        <div onClick={()=>onChoose(item)}>
          <Img src={item.link} alt={item.name} />
          <span>{item.name}</span>
        </div>
      </li>
    ));

  useEffect(() => {
    fetch('/static/images.json', { cache: 'no-cache' })
      .then((res) => res.json() as Promise<Array<ImageItem>>)
      .then((list) => setImageItem(list)).catch(err=>{
         alert.error((err as Error).message);
        setImageItem([]);
      })
  },[]);

  const Images = getImageList();

  return <ul className={styles.imagelist}>{Images}</ul>;
}

export { ImageList };
