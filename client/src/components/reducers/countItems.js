const CountItemsReducer = (state = [], action) => {
  switch (action.type) {
    case "COUNT_ITEMS":
      return action.payload;
    default:
      return state;
  }
};

export default CountItemsReducer;
