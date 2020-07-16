import { combineReducers } from "redux";
import loggedReducer from "./userLogged";
import RestloggedReducer from "./restLogged";
import DelloggedReducer from "./delLogged";
import CountItemsReducer from "./countItems";
import GrandTotalReducer from "./total";
import FinalLocationsReducer from "./finalLocations";
import DelUserIDReducer from "./delUserID";

const allReducers = combineReducers({
  userLogged: loggedReducer,
  restLogged: RestloggedReducer,
  delLogged: DelloggedReducer,
  countItems: CountItemsReducer,
  total: GrandTotalReducer,
  finalLocations: FinalLocationsReducer,
  delUserID: DelUserIDReducer,
});

export default allReducers;
