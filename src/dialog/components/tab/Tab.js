import React from 'react';
import compact from 'lodash/compact';
import styles from './Tab.scss';

export function Tab({
  favicon,
  title,
  url,
  labels = [],
  active,
  cls,
  onEnter,
  onSelect
}) {
  const rootStyle = compact([styles.root, active ? styles.active : '', cls]);
  return (
    <div
      className={rootStyle.join(' ')}
      onMouseEnter={onEnter}
      onClick={onSelect}
    >
      <img className={styles.img} alt="" src={favicon} />
      <div className={styles.right}>
        <div className={styles.labelTitle}>
          <div className={styles.labels}>
            {labels.map(({ color, text }) => (
              <div style={{ backgroundColor: color }} className={styles.label}>
                {text}
              </div>
            ))}
          </div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.url}>{url}</div>
      </div>
    </div>
  );
}
