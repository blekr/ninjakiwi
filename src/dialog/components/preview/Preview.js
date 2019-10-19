import React from 'react';
import styles from './Preview.scss';

const WIN_SIZE = 3;

function getVisible(total, index) {
  let start;
  let end;
  if (index >= Math.floor(total / WIN_SIZE) * WIN_SIZE) {
    start = Math.max(0, total - WIN_SIZE);
    end = total;
  } else {
    start = Math.floor(index / WIN_SIZE) * WIN_SIZE;
    end = start + WIN_SIZE;
  }
  return {
    start,
    end: end - 1
  };

  // for (let i = start; i < end; i++) {
  //   visible.push({
  //     imgIndex: i,
  //     active: i === index
  //   });
  // }
  // return visible;
}

function getClass(total, index, visible, imgIndex) {
  const classes = [styles.img];
  if (imgIndex === visible.start) {
    classes.push(styles.big);
  }
  if (imgIndex !== total - 1) {
    classes.push(styles.paddingBottom);
  }
  if (imgIndex === index) {
    classes.push(styles.active);
  }
  return classes.join(' ');
}

function getOffset(visible) {
  console.log('----offset', visible.start * 160);
  return visible.start * 160;
}

export function Preview({ pages, index }) {
  const visible = getVisible(pages.length, index);
  return (
    <div className={styles.root}>
      <div
        className={styles.images}
        style={{ transform: `translateY(-${getOffset(visible)}px)` }}
      >
        {pages.map((page, imgIndex) => (
          <div
            key={page.id}
            className={getClass(pages.length, index, visible, imgIndex)}
            style={{ backgroundImage: `url(${page.screenImg})` }}
          />
        ))}
      </div>
    </div>
  );
}
