import React from 'react';
import get from 'lodash/fp/get';
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import style from './Container.scss';
import { insertCss } from '../../../tools';
import { Tab } from '../tab/Tab';
import { search } from '../../actions/search';
import { Preview } from '../preview/Preview';

insertCss(style[0][1]);
const styles = style.locals;

function render({ text, pages, setText, manipulate: { index } }) {
  return (
    <div className={styles.root}>
      <Preview pages={pages} index={index} />
      <div className={styles.right}>
        <div className={styles.inputContainer}>
          <input value={text} onChange={e => setText(e.target.value)} />
          <div className={styles.logo}>Ubala</div>
        </div>
        <div className={styles.tabs}>
          {pages.map((page, imgIndex) => (
            <Tab {...page} key={page.id} active={imgIndex === index} />
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
      manipulate
    }),
    dispatch => ({
      search(text) {
        dispatch(search(text));
      }
    })
  ),
  withState('text', 'setText', ''),
  lifecycle({
    componentDidMount() {
      this.props.search();
    }
  })
)(render);
