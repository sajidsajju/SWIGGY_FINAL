const GrandTotalReducer = (state = 0, action) => {
  switch (action.type) {
    case "TOTAL":
      return action.payload;
    default:
      return state;
  }
};

export default GrandTotalReducer;
