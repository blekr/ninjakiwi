import React from 'react';
import get from 'lodash/get';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import styles from './Main.scss';
import { Container } from '../container/Container';
import { activateLast, closeDialog } from '../../tools';

function render({ bgImg, closerRef, onClick }) {
  return (
    <div className={styles.root}>
      {bgImg && (
        <div className={styles.layerPreview}>
          <div
            className={styles.img}
            style={{ backgroundImage: `url(${bgImg})` }}
          />
          <div className={styles.mask} />
        </div>
      )}
      <div className={styles.layerContent} ref={closerRef} onClick={onClick}>
        <Container />
      </div>
    </div>
  );
}

export const Main = compose(
  connect(({ manipulate: { index }, page: { pages, pageIds } }) => ({
    bgImg: get(get(pages, get(pageIds, index)), 'screenImg')
  })),
  withProps({
    closerRef: React.createRef()
  }),
  withHandlers({
    onClick: ({ closerRef }) => async e => {
      if (e.target === closerRef.current) {
        await activateLast();
        await closeDialog();
      }
    }
  })
)(render);
