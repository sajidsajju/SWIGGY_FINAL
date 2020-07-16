const FinalLocationsReducer = (state = [], action) => {
  switch (action.type) {
    case "FINAL_LOCATIONS":
      return action.payload;
    default:
      return state;
  }
};

export default FinalLocationsReducer;
