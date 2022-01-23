import React, { FC } from 'react';
import styles from './Overlay.module.css';

interface Props {
  children: any;
}

const Overlay: FC<Props> = ({ children }) => {
  return <div className={styles.overlay}>{children}</div>;
};

export default Overlay;
