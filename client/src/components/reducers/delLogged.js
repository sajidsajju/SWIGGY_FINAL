const DelloggedReducer = (state = false, action) => {
  switch (action.type) {
    case "DEL_SIGN_IN":
      return action.payload;
    default:
      return state;
  }
};

export default DelloggedReducer;
