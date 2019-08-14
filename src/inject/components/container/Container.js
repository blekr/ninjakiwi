import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import style from './Container.scss';
import { insertCss } from '../../../tools';
import { Tab } from '../tab/Tab';
import { search } from '../../actions/search';

insertCss(style[0][1]);
const styles = style.locals;

function render({ text, tabs, setText }) {
  return (
    <div className={styles.root}>
      <div className={styles.images}>
        {tabs[0] && (
          <img className={styles.imgFirst} alt="" src={tabs[0].screenImg} />
        )}
        {tabs[1] && (
          <img className={styles.img} alt="" src={tabs[1].screenImg} />
        )}
        {tabs[2] && (
          <img className={styles.img} alt="" src={tabs[2].screenImg} />
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.inputContainer}>
          <input value={text} onChange={e => setText(e.target.value)} />
          <div className={styles.logo}>Ubala</div>
        </div>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <Tab {...tab} key={tab.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Container = compose(
  connect(
    ({ tab: { tabs, tabIds } }) => ({
      tabs: tabIds.map(tabId => tabs[tabId])
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
