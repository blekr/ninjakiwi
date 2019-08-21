import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import style from './Container.scss';
import { insertCss } from '../../../tools';
import { Tab } from '../tab/Tab';
import { search } from '../../actions/search';

insertCss(style[0][1]);
const styles = style.locals;

function render({ text, pages, setText }) {
  return (
    <div className={styles.root}>
      <div className={styles.images}>
        {pages[0] && (
          <div
            className={styles.imgFirst}
            style={{
              backgroundImage: `url(${pages[0].screenImg ||
                'https://developer.chrome.com/static/images/tabs.png'})`
            }}
          />
        )}
        {pages[1] && (
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${pages[1].screenImg ||
                'https://developer.chrome.com/static/images/tabs.png'})`
            }}
          />
        )}
        {pages[2] && (
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${pages[2].screenImg ||
                'https://developer.chrome.com/static/images/tabs.png'})`
            }}
          />
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.inputContainer}>
          <input value={text} onChange={e => setText(e.target.value)} />
          <div className={styles.logo}>Ubala</div>
        </div>
        <div className={styles.tabs}>
          {pages.map((page, index) => (
            <Tab {...page} key={page.id} active={index === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Container = compose(
  connect(
    ({ page: { pages, pageIds } }) => ({
      pages: pageIds.map(pageId => pages[pageId])
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
