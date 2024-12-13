import { FC, memo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';
import { useClose } from '../../useClose';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useClose({ isOpen: true, onClose, rootRef });

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose} ref={rootRef}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
