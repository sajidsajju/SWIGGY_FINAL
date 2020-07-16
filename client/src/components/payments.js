import React, { useState, useEffect } from "react";
import {
  makeStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { userLogged, countItems, finalLocations, delUserID } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Navbar from "./userNavbar";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import leafletKnn from 'leaflet-knn';
import L from "leaflet";

const useStyles = makeStyles((theme) => ({
  body: {
    width: "100%",

  },
  submit: {
    width: "35%",
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    maxWidth: 300,
    flexGrow: 1,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // fontFamily: '-apple-system',
    // 'BlinkMacSystemFont',
    // '"Segoe UI"',
    // 'Roboto',
    // '"Helvetica Neue"',
    // 'Arial',
    // 'sans-serif',
    // '"Apple Color Emoji"',
    // '"Segoe UI Emoji"',
    // '"Segoe UI Symbol"',
    backgroundColor: "#66023c",    //red[500],
    color: "#FFFFFF"
  },
  table: {
    minWidth: 1000,
  },
  totalStyles: {
    fontSize: "25px",
    color: "#000000",
    fontWeight: "bold"
  },
  totalStylesNames: {
    fontSize: "20px",
    color: "#000000",
    fontWeight: "bold"
  }
}));

export default function UserCart({ match }) {
  document.title = "Swiggy Payments";
  const classes = useStyles();
  const [radioValue, setRadioValue] = useState('COD');
  const [delLocation, setDelLocation] = useState({});
  const [restLocation, setRestLocation] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const [smap, setMap] = useState(false);
  const [noDelUsersDisp, setNoDelUsersDisp] = useState("none");
  const [open, setOpen] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [multipleOrders, setMultipleOrders] = useState(true);


  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  let grandTotal = useSelector((state) => state.total);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const dispatch = useDispatch();


  const handleChange = (event) => {
    setRadioValue(event.target.value);
  };

  const placeOrder = () => {

    if (delLocation.length !== 0) {
      setBtnDisable(true);

      var gj = L.geoJSON(delLocation)

      var nearest = leafletKnn(gj).nearest(L.latLng(restLocation.longitude, restLocation.latitude), 100);

      const nearestDelUser = [];

      delLocation.map((delUser) => {

        if (delUser.coordinates[0][0] === nearest[0].lon && delUser.coordinates[0][1] === nearest[0].lat) {
          dispatch(delUserID(delUser.did));
          nearestDelUser.push(delUser);
        }
      });

      const allLocations = [
        [nearest[0].lon, nearest[0].lat],  //delivery
        [restLocation.latitude, restLocation.longitude], //restaurant
        [userLocation.latitude, userLocation.longitude] //user

      ];
      dispatch(finalLocations(allLocations));

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      };

      const details = {
        items: countItems1,
        total: grandTotal,
        allLocations: allLocations,
      };
      axios.post(`api/orderedHistory/${nearestDelUser[0].did}`, details, config)
        .then((res) => {
          setBtnDisable(false);
          setMap(true);
          handleClickOpen();
        })
        .catch((err) => console.log(err));
    }
    else {
      setNoDelUsersDisp("");
      setTimeout(() => {
        setNoDelUsersDisp("none");
      }, 5000);
    }
  };



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
    axios
      .get("api/cart/", config)
      .then((res) => {
        if (res.data.success) {
          dispatch(countItems(res.data.message));
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("api/getOrders/", config)
      .then((res) => {
        if (res.data.success) {
          setMultipleOrders(res.data.message);
        }
      })
      .catch((err) => console.log(err));


    axios
      .get(`api/restLocation/`, config)
      .then((res) => {
        if (res.data.success) {
          setRestLocation(res.data.message);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`api/userLocation/`, config)
      .then((res) => {
        if (res.data.success) {
          setUserLocation(res.data.message);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("api/delLocation/", config)
      .then((res) => {
        if (res.data.success) {
          let data = [];
          res.data.message.map((user) => {
            if (user.location[0] !== undefined && user.addresses[0] !== undefined) {
              data.push({

                "type": "LineString", //Point
                did: user._id,
                "coordinates": [
                  [user.location[user.location.length - 1].latitude, user.location[user.location.length - 1].longitude]
                ]
              })
            }
          })

          setDelLocation(data);
        }

      })
      .catch((err) => console.log(err));
  }, [dispatch]);


  if (smap) {
    return <Redirect to="/live_tracking" />
  }

  function loggedOut() {
    dispatch(userLogged(false));
    localStorage.removeItem("user-token");
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }
  return (
    <div className={classes.body}>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
      />


      <Alert
        variant="filled"
        severity="error"
        style={{ display: noDelUsersDisp }}
      >
        All Delivery Users are Busy, Please try after sometime.
              </Alert>
      {multipleOrders ? null : <Alert
        variant="filled"
        severity="warning"
      >
        Another order in Progress
              </Alert>
      }
      <div align="center">
        <Typography style={{ fontWeight: "bold", fontSize: "30px" }}>Payments :</Typography><br /><br />
        <Typography style={{ fontWeight: "bold", fontSize: "20px" }}>To Pay: <img width="15" alt="$" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{grandTotal}</Typography>

      </div>
      <div style={{ margin: 50 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Options :</FormLabel>
          <RadioGroup aria-label="payments" name="payment" value={radioValue} onChange={handleChange}>
            <FormControlLabel value="COD" control={<Radio />} label="COD" style={{ fontWeight: "bold" }} />
            <FormControlLabel value="UPI" disabled control={<Radio />} label="UPI" style={{ fontWeight: "bold" }} />
          </RadioGroup>
        </FormControl>
      </div>
      <div align="center">
        {multipleOrders ?
          <Button
            // fullWidth
            align="center"
            variant="contained"
            color="secondary"
            className={classes.submit}
            style={{ backgroundColor: "#fe4a49", color: "#FFFFFF" }}
            onClick={() => { placeOrder() }}
            disabled={btnDisable}
          >
            Confirm Order
                </Button>
          : null}

      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
            Order is confirmed, you can now track your order.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
