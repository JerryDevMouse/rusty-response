import React from 'react';
import styles from './index.module.css';
interface ConditionalLoaderProps {
  isLoading: boolean,
  children: React.ReactNode,
  loader: React.ReactNode,
  isTable: boolean,
  minHeight?: string;
}

const ConditionalLoader: React.FC<ConditionalLoaderProps> = ({
  isLoading,
  children,
  loader,
  isTable,
  minHeight = '200px',
}) => {
  if (isTable) return (
    <tbody className={styles.container}>
      <tr className={`${styles.loaderWrapper} ${styles.trWrapper} ${isLoading ? styles.visible : ''}`}>
        {loader}
      </tr>
      {!isLoading && children}
    </tbody>
  )

  return (
    <div className={styles.container} style={{ minHeight }}>
      <div className={`${styles.loaderWrapper} ${isLoading ? styles.visible : ''}`}>
        {loader}
      </div>
      <div className={`${styles.content} ${!isLoading ? styles.visible : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ConditionalLoader