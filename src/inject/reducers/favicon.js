export default function(state = {}, { type, data } = {}) {
  switch (type) {
    case 'SET_FAVICON': {
      const { id, favicon } = data;
      return {
        ...state,
        [id]: favicon
      };
    }
    default:
      return state;
  }
}
