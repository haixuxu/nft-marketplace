import { useState, ImgHTMLAttributes, useEffect, useRef } from 'react';

export interface IImgProps<T> extends ImgHTMLAttributes<T> {
  loadingImg?: string;
  errorImg?: string;
  src: string;
}

import loadImg from './imgs/loading.gif';
import errorImg from './imgs/error.png';
export function Img(props: IImgProps<any>) {
  const [src, setSrc] = useState(props.loadingImg as string);
  const imgRef = useRef({} as any);

    // 滚动事件
    const detectVisable = () => {
      const rect = imgRef.current.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      ) {
        startLoadTask();
      }
    };
  
    useEffect(() => {
      detectVisable();
      // 监听滚动事件
      window.addEventListener('scroll', detectVisable);
      // 在组件卸载时清除监听器
      return () => {
        window.removeEventListener('scroll', detectVisable);
      };
    }, []);

  const startLoadTask = () => {
    const imgDom = new Image();
    imgDom.src = props.src;

    imgDom.onload = function () {
      setSrc(props.src);
    };

    imgDom.onerror = function () {
      setSrc(props.errorImg as string);
    };
  };


  return (
    <>
      <img
        src={src}
        ref={imgRef}
        style={{
          height: 'inherit',
        }}></img>
    </>
  );
}

Img.defaultProps = {
  loadingImg: loadImg,
  errorImg: errorImg,
};
