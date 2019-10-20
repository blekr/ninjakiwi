import React from 'react';
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
import { contentCom } from '../../../communication/content';
import { backgroundCom } from '../../../communication/background';

function render({
  text,
  pages,
  setText,
  manipulate: { index },
  inputRef,
  setIndex,
  hasBgImg,
  openUrl
}) {
  return (
    <div
      className={styles.root}
      style={{
        backgroundColor: hasBgImg
          ? 'rgba(25, 25, 25, 0.75)'
          : 'rgba(25, 25, 25, 1)'
      }}
    >
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
            onEnter={() => setIndex(imgIndex)}
            onSelect={() => openUrl(page.url)}
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
      manipulate,
      hasBgImg: !!get(get(pages, get(pageIds, manipulate.index)), 'screenImg')
    }),
    dispatch => ({
      search(text) {
        dispatch(search(text));
      },
      setIndex(index) {
        dispatch(setIndex(index));
      }
    })
  ),
  withState('text', 'setText', ''),
  withProps({
    inputRef: React.createRef()
  }),
  withHandlers({
    openUrl: () => url => {
      contentCom.callBackground('OPEN_URL', { url });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.search();
      this.props.inputRef.current.focus();
    }
  })
)(render);
