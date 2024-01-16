import styles from "@/styles/market.module.css"

import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prevText) => {
        const newLoadingText = prevText.endsWith('...') ? 'Loading' : prevText + '.';
        return newLoadingText;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <div className={styles.loading}>{loadingText}</div>;
};

export default Loading;