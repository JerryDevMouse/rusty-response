import React from 'react';
import styles from './index.module.css';

interface ConditionalLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loader: React.ReactNode;
  minHeight?: string;
}

const ConditionalLoader: React.FC<ConditionalLoaderProps> = ({
  isLoading,
  children,
  loader,
  minHeight = '200px'
}) => {
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

export default ConditionalLoader;