export function moveForward() {
  return (dispatch, getStore) => {
    const store = getStore();
    const total = store.page.pageIds.length;
    const { index } = store.manipulate;
    dispatch({
      type: 'SET_INDEX',
      data: {
        index: Math.min(index + 1, total - 1)
      }
    });
  };
}

export function moveBackward() {
  return (dispatch, getStore) => {
    const store = getStore();
    const { index } = store.manipulate;
    dispatch({
      type: 'SET_INDEX',
      data: {
        index: Math.max(0, index - 1)
      }
    });
  };
}

export function commandMode() {
  return {
    type: 'SET_MODE',
    data: {
      mode: 'COMMAND'
    }
  };
}
