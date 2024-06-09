import { useState } from 'react';
import { CreateForm } from './CreateForm';
import { ImageList } from './ImageList';
import { ImageItem } from 'types';


export function Create() {
  const [cimage,setImage] = useState<ImageItem>();
  
  const chooseImage = (item:ImageItem)=>{
    setImage(item);
  }

  return <div className='create-page'>{cimage ? <CreateForm cimage={cimage}></CreateForm> : <ImageList onChoose={chooseImage}></ImageList>}</div>;
}
