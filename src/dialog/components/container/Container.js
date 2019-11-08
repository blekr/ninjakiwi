/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import size from 'lodash/size';
import {
  compose,
  withHandlers,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';
import styles from './Container.scss';
import { Tab } from '../tab/Tab';
import { search } from '../../actions/search';
import { setIndex } from '../../actions/manipulate';
import { cancel, goto } from '../../actions/opener';
import { setText } from '../../actions/input';
import logo from '../../../../assets/kiwi.png';

function render({
  text,
  pages,
  onChangeText,
  manipulate: { index },
  inputRef,
  closerRef,
  setIndex,
  hasBgImg,
  openUrl,
  onClick,
}) {
  return (
    <div className={styles.root} ref={closerRef} onClick={onClick}>
      <div
        className={styles.bg}
        style={{
          backgroundColor: hasBgImg
            ? 'rgba(25, 25, 25, 0.75)'
            : 'rgba(25, 25, 25, 1)'
        }}
      >
        <div className={styles.inputContainer}>
          <input
            autoFocus
            value={text}
            onChange={e => onChangeText(e.target.value)}
            ref={inputRef}
          />
          <div className={styles.logoContainer}>
            <img className={styles.logo} src={logo} alt="kiwi logo" />
            <div className={styles.name}>Kiwi</div>
          </div>
        </div>
        <div className={styles.tabs}>
          {pages.map((page, imgIndex) => (
            <Tab
              {...page}
              key={page.id}
              active={imgIndex === index}
              cls={imgIndex !== size(pages) - 1 && styles.tab}
              onEnter={() => setIndex(imgIndex)}
              onSelect={() => openUrl(page.url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Container = compose(
  connect(
    ({ input, page: { pages, pageIds }, manipulate }) => ({
      pages: pageIds.map(pageId => pages[pageId]),
      manipulate,
      hasBgImg: !!get(get(pages, get(pageIds, manipulate.index)), 'screenImg'),
      text: input
    }),
    dispatch => ({
      search(text) {
        dispatch(search(text));
      },
      setIndex(index) {
        dispatch(setIndex(index));
      },
      goto(url) {
        dispatch(goto(url));
      },
      setText(text) {
        dispatch(setText(text));
      },
      cancel() {
        dispatch(cancel());
      }
    })
  ),
  withProps({
    inputRef: React.createRef(),
    closerRef: React.createRef()
  }),
  withHandlers(({ search }) => {
    const debounceSearch = debounce(text => search(text), 10);
    return {
      openUrl: ({ goto }) => async url => {
        goto(url);
      },
      onChangeText: ({ setText }) => text => {
        setText(text);
        debounceSearch(text);
      },
      onClick: ({ closerRef, cancel }) => e => {
        if (e.target === closerRef.current) {
          cancel();
        }
      }
    };
  })
)(render);
