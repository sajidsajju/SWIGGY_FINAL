import React, { useState, useEffect } from "react";
import Navbar from "./userNavbar";
import { Grid } from "@material-ui/core";
import axios from "axios";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { userLogged } from "../components/actions";
import jwtDecode from "jwt-decode";

export default function RestOrders({ match }) {
  document.title = "User Orders";

  const [getOrderData, setGetOrderData] = useState({});

  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;
      if (Date.now() >= expirationTime) {
        dispatch(userLogged(false));
        localStorage.removeItem("user-token");
      }
    } catch (e) { }
    if (token) dispatch(userLogged(true));
    else dispatch(userLogged(false));

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
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
    dispatch(userLogged(false));
    localStorage.removeItem("user-token");
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
        cartDisabling=""
        ordersDisabling=""
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
            <p>Restaurant : {getOrderData.rname}</p>
            <p>Restaurant Owner : {getOrderData.restOwnerName}</p>
            <p>Phone : {getOrderData.restPhone}</p>
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
