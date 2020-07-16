const RestloggedReducer = (state = false, action) => {
  switch (action.type) {
    case "REST_SIGN_IN":
      return action.payload;
    default:
      return state;
  }
};

export default RestloggedReducer;
