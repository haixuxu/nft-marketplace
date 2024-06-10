import clsx from 'clsx';
import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@gear-js/ui';
import icon from './images/x.svg';
import styles from './Modal.module.scss';

export type ModalProps = {
  heading: string;
  close: () => void;
  children?: ReactNode;
  className?: string;
  modalClass?:string;
};

const Modal = ({ heading, close, children, className,modalClass }: ModalProps) => {
  const [root, setRoot] = useState<HTMLDivElement>();
  const bodyClassName = clsx(styles.body, className);

  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) close();
  };

  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    setRoot(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const additionalClass = modalClass;

  const component = (
    <div className={`${styles.overlay} ${additionalClass}`} onClick={handleOverlayClick} data-testid="overlay">
      <div className={styles.modal} data-testid="modal">
        <Button className={styles.button} icon={icon} color="transparent" onClick={close} />
        <h3 className={styles.heading}>{heading}</h3>
        {children && (
          <div className={bodyClassName} data-testid="body">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
};

export { Modal, styles as modalStyles };
