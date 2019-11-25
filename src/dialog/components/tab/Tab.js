import React from 'react';
import compact from 'lodash/compact';
import styles from './Tab.scss';

export function Tab({
  favicon,
  coloredTitle,
  coloredUrl,
  newTab,
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
        <div className={styles.left}>
          <div className={styles.labelTitle}>
            <div className={styles.labels}>
              {labels.map(({ color, text }) => (
                <div
                  style={{ backgroundColor: color }}
                  className={styles.label}
                >
                  {text}
                </div>
              ))}
            </div>
            <div
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: coloredTitle }}
            />
          </div>
          <div
            className={styles.url}
            dangerouslySetInnerHTML={{ __html: coloredUrl }}
          />
        </div>
        {newTab && (
          <div className={styles.icons}>
            <img src="../../../../assets/newTab.png" alt="open new tab" />
          </div>
        )}
      </div>
    </div>
  );
}
