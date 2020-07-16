const DelUserIDReducer = (state = "", action) => {
  switch (action.type) {
    case "DEL_ID":
      return action.payload;
    default:
      return state;
  }
};

export default DelUserIDReducer;
