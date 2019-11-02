const initState = {
  tabId: null,
  url: null
};

export default (state = initState, { type, data } = {}) => {
  switch (type) {
    case 'SET_OPENER':
      return data;
    default:
      return state;
  }
};
