import { useEffect, useRef, useState } from 'react';
import styles from './ImageList.module.scss';
import { ImageItem } from 'types';
import { useAlert } from '@gear-js/react-hooks';
import {Img} from 'components';
import { useNavigate } from 'react-router-dom';

function ImageList() {
  let [ImageItems, setImageItem] = useState<Array<ImageItem>>([]);
  const alert = useAlert();
  const navigaway = useNavigate();
  

  const onChoose = (item2:ImageItem)=>{
    localStorage.setItem("chooseModel",JSON.stringify(item2));
    console.log('click===',item2);
    navigaway("/create");
  }

  const getImageList = () =>
    ImageItems.map((item,index) => (
      <li key={index}>
        <div onClick={()=>onChoose(item)} className={styles.carditem}>
          <Img src={item.link} alt={item.name} />
          <div className={styles.btitle}>{item.name}</div>
          <div className={styles.mintIcon}>Mint</div>
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
