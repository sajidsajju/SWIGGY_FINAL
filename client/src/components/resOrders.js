import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import {  Grid } from "@material-ui/core";
import axios from "axios";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { restLogged } from "../components/actions";
import jwtDecode from "jwt-decode";

export default function RestOrders({ match }) {
  document.title = "Restaurant Orders";
  const [getOrderData, setGetOrderData] = useState({});

  let isLoggedState = useSelector((state) => state.restLogged);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("rest-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;

      if (Date.now() >= expirationTime) {
        dispatch(restLogged(false));
        localStorage.removeItem("rest-token");
      }
    } catch (e) { }
    if (token) dispatch(restLogged(true));
    else dispatch(restLogged(false));

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };
    const fetchData = async () => {
      await axios
        .get("api/getParticularOrders/" + match.params.id, config)
        .then((res) => {
          if (res.data.success) {
            setGetOrderData(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();

  }, [dispatch, match.params]);

  function loggedOut() {
    dispatch(restLogged(false));
    localStorage.removeItem("rest-token");
  }

  if (!isLoggedState) {
    return <Redirect to="/restaurantLogin" />;
  }
  return (
    <div>
      <Navbar
        link="/restaurantLogin"
        authToken="rest-token"
        loggedOut={loggedOut}
        disabling=""
      />

      <Grid
        container
        directio="column"
        justify="center"
        alignItems="center"
      // spacing={6}
      >
        <Grid item xs={6} className="typo">
          <div>
            <p style={{ margin: 30 }}> Delivery Boy Name : {getOrderData.dname}</p>
            <p style={{ margin: 30 }}>Phone : {getOrderData.delPhone}</p>
          </div>
        </Grid>
        <Grid item xs={6} className="typo">
          <div>
            <p>Customer Name : {getOrderData.uname}</p>
            <p>Phone : {getOrderData.userPhone}</p>
          </div>
        </Grid>
      </Grid>
      <hr
        style={{
          backgroundColor: "black",
          height: 1,
          //   width: 600,
        }}
      />
      <Grid container directio="column"
        justify="center" spacing={3}
      >
        {getOrderData.items ? getOrderData.items.map((item) => (
          <Grid item xs={4} key={item._id}>
            <div style={{ margin: 20 }}>
              <div style={{ width: 80, height: 80 }}>
                <Image disableSpinner={true} src={item.itemImage ? `uploads/${item.itemImage}` : ""} />
              </div>
              <p>Item Name : {item.itemName}</p>
              <p>Count: {item.count}</p>
            </div>
          </Grid>
        )) : <div></div>
        }
      </Grid>


    </div>
  )
};
