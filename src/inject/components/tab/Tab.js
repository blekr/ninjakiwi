import React from 'react';
import style from './Tab.scss';
import { insertCss } from '../../../tools';

insertCss(style[0][1]);
const styles = style.locals;
export function Tab({ favicon, title, labels }) {
  return (
    <div className={styles.root}>
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
        <div className={styles.url} />
      </div>
    </div>
  );
}
