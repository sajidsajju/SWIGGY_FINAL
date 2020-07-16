export const userLogged = (x) => {
  return {
    type: "SIGN_IN",
    payload: x,
  };
};

export const restLogged = (x) => {
  return {
    type: "REST_SIGN_IN",
    payload: x,
  };
};

export const delLogged = (x) => {
  return {
    type: "DEL_SIGN_IN",
    payload: x,
  };
};
export const countItems = (x) => {
  return {
    type: "COUNT_ITEMS",
    payload: x,
  }
};
export const total = (x) => {
  return {
    type: "TOTAL",
    payload: x,
  }
};
export const finalLocations = (x) => {
  return {
    type: "FINAL_LOCATIONS",
    payload: x,
  }
};
export const delUserID = (x) => {
  return {
    type: "DEL_ID",
    payload: x,
  }
};