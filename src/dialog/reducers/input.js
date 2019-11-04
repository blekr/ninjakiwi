export default (state = '', { type, data } = {}) => {
  switch (type) {
    case 'SET_TEXT':
      return data;
    default:
      return state;
  }
};
