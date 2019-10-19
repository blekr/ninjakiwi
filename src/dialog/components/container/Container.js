import React from 'react';
import get from 'lodash/fp/get';
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
import { Preview } from '../preview/Preview';

function render({ text, pages, setText, manipulate: { index }, inputRef }) {
  return (
    <div className={styles.root}>
      <div className={styles.inputContainer}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
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
          />
        ))}
      </div>
    </div>
  );
}

export const Container = compose(
  connect(
    ({ page: { pages, pageIds }, manipulate }) => ({
      pages: pageIds.map(pageId => pages[pageId]),
      manipulate
    }),
    dispatch => ({
      search(text) {
        dispatch(search(text));
      }
    })
  ),
  withState('text', 'setText', ''),
  withProps({
    inputRef: React.createRef()
  }),
  lifecycle({
    componentDidMount() {
      this.props.search();
      this.props.inputRef.current.focus();
    }
  })
)(render);
