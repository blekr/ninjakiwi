import React from 'react';
import get from 'lodash/get';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import styles from './Main.scss';
import { Container } from '../container/Container';

function render({ bgImg }) {
  console.log('----bgImg', bgImg);
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
      <div className={styles.layerContent}>
        <Container />
      </div>
    </div>
  );
}

export const Main = compose(
  connect(({ manipulate: { index }, page: { pages, pageIds } }) => ({
    bgImg: get(get(pages, get(pageIds, index)), 'screenImg')
  }))
)(render);
