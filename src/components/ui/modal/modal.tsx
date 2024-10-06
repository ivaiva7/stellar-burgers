import { forwardRef, FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI = memo(
  forwardRef<HTMLDivElement, TModalUIProps>(
    ({ title, onClose, children }, ref) => (
      <>
        <div className={styles.modal} ref={ref}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text text_type_main-large`}>
              {title}
            </h3>
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    )
  )
);
