import React from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import size from 'lodash/size';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState
} from 'recompose';
import { connect } from 'react-redux';
import styles from './Container.scss';
import { Tab } from '../tab/Tab';
import { search } from '../../actions/search';
import { setIndex } from '../../actions/manipulate';
import { goto } from '../../actions/opener';

function render({
  text,
  pages,
  onChangeText,
  manipulate: { index },
  inputRef,
  setIndex,
  hasBgImg,
  openUrl
}) {
  return (
    <div className={styles.root}>
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
            value={text}
            onChange={e => onChangeText(e.target.value)}
            ref={inputRef}
          />
          <div className={styles.logo}>Ubala</div>
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
    ({ page: { pages, pageIds }, manipulate }) => ({
      pages: pageIds.map(pageId => pages[pageId]),
      manipulate,
      hasBgImg: !!get(get(pages, get(pageIds, manipulate.index)), 'screenImg')
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
      }
    })
  ),
  withState('text', 'setText', ''),
  withProps({
    inputRef: React.createRef()
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
      }
    };
  }),
  lifecycle({
    componentDidMount() {
      this.props.inputRef.current.focus();
    }
  })
)(render);
