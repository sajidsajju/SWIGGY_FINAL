import React from "react";
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import userLogin from "./components/forms/userLogin";
import restLogin from "./components/forms/restLogin";
import delLogin from "./components/forms/delLogin";
import Whoops404 from "./components/Whoops404";
import userRegister from "./components/forms/userRegister";
import restRegister from "./components/forms/restRegister";
import delRegister from "./components/forms/delRegister";
import userRecover from "./components/forms/userRecover";
import restRecover from "./components/forms/restRecover";
import delRecover from "./components/forms/delRecover";
import reset from "./components/forms/reset";
import resProducts from "./components/resProducts";
import map from "./components/maps";
import restDetails from "./components/restDetails";
import editItems from "./components/editItems";
import userPage from "./components/userPage";
import userMap from "./components/userMaps";
import userAdress from "./components/userAddress";
import userPageItems from "./components/userPageItems";
import userCart from "./components/userCart";
import payments from "./components/payments";
import liveTrackingMaps from "./components/liveTrackingMap";
import restOrders from "./components/resOrders";
import delOrders from "./components/delOrders";
import userOrders from "./components/userOrders";
import userOrderHistory from "./components/userOrderHistory";
import deliveryPage from "./components/deliveryPage";
import deliveryAddress from "./components/deliveryAddress";
import deliveryMap from "./components/delMaps";
import delLiveTrackingMaps from "./components/delLiveTrackingMap";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={"/"} component={userLogin} />
        <Route path={"/restaurantLogin"} component={restLogin} />
        <Route path={"/deliveryLogin"} component={delLogin} />
        <Route path={"/register"} component={userRegister} />
        <Route path={"/restRegister"} component={restRegister} />
        <Route path={"/delRegister"} component={delRegister} />
        <Route path={"/recover"} component={userRecover} />
        <Route path={"/restRecover"} component={restRecover} />
        <Route path={"/delRecover"} component={delRecover} />
        <Route path={"/reset/:type/:token"} component={reset} />
        <Route path={"/restaurant"} component={resProducts} />
        <Route path={"/map"} component={map} />
        <Route path={"/restaurant_address"} component={restDetails} />
        <Route path={"/restaurant_items/edit/:uid/:id"} component={editItems} />
        <Route path={"/home"} component={userPage} />
        <Route path={"/user_map"} component={userMap} />
        <Route path={"/user_address"} component={userAdress} />
        <Route path={"/home_user/items/:id"} component={userPageItems} />
        <Route path={"/user_cart"} component={userCart} />
        <Route path={"/payments"} component={payments} />
        <Route path={"/live_Tracking"} component={liveTrackingMaps} />
        <Route path={"/delivery_order_details/:id"} component={delOrders} />
        <Route path={"/restaurant_order_details/:id"} component={restOrders} />
        <Route path={"/order_details/:id"} component={userOrders} />
        <Route path={"/order_history"} component={userOrderHistory} />
        <Route path={"/delivery_home"} component={deliveryPage} />
        <Route path={"/del_map"} component={deliveryMap} />
        <Route path={"/delivery_address"} component={deliveryAddress} />
        <Route path={"/del_live_Tracking"} component={delLiveTrackingMaps} />
        <Route component={Whoops404} />
      </Switch>
    </Router>
  );
}

export default App;
