import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import "./stylesheets/style.css";
import { createStore } from "redux";
import allReducers from "./components/reducers";
import { Provider } from "react-redux";

window.React = React;

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
