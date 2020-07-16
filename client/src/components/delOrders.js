import React, { useState, useEffect } from "react";
import Navbar from "./delNavbar";
import { Grid } from "@material-ui/core";
import axios from "axios";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { delLogged } from "../components/actions";
import jwtDecode from "jwt-decode";



export default function DelOrders({ match }) {
  document.title = "Delivery Orders";
  const [getOrderData, setGetOrderData] = useState({});

  let isLoggedState = useSelector((state) => state.delLogged);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("del-token");
    try {
      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000 - 10000;

      if (Date.now() >= expirationTime) {
        dispatch(delLogged(false));
        localStorage.removeItem("del-token");
      }
    } catch (e) { }
    if (token) dispatch(delLogged(true));
    else dispatch(delLogged(false));

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    const fetchData = async () => {
      await axios
        .get("/api/getParticularOrders/" + match.params.id, config)
        .then((res) => {
          if (res.data.success) {
            setGetOrderData(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();

  }, [match.params.id, dispatch]);

  function loggedOut() {
    dispatch(delLogged(false));
    localStorage.removeItem("del-token");
  }

  if (!isLoggedState) {
    return <Redirect to="/deliveryLogin" />;
  }
  return (
    <div>
      <Navbar
        link="/deliveryLogin"
        authToken="del-token"
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
            <p style={{ margin: 30 }}> Restaurant : {getOrderData.rname}</p>
            <p style={{ margin: 30 }}> Restaurant Owner : {getOrderData.restOwnerName}</p>
            <p style={{ margin: 30 }}>Phone : {getOrderData.restPhone}</p>
          </div>
        </Grid>
        <Grid item xs={6} className="typo">
          <div>
            <p>Customer Name : {getOrderData.uname}</p>
            <p>Phone : {getOrderData.userPhone}</p>
            <p>Total Amount : <img style={{ fontWeight: "initial" }} width="15" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" alt="$" />{getOrderData.total}</p>
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
                <Image disableSpinner={true} src={item.itemImage ? `/uploads/${item.itemImage}` : ""} />
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
