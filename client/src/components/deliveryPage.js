import React, { useState, useEffect } from "react";
import Navbar from "./delNavbar";
import {
  makeStyles,
  withStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { delLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#36454f", //theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
    backgroundColor: "#36454f",
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginError: {
    paddingTop: 20,
    paddingLeft: "25%",
    fontSize: 17,
    fontFamily: "Helvetica",
    color: "#d8000c",
  },
  title: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: orange,
  },
  table: {
    minWidth: 1000,
  },
}));

export default function DeliveryPage() {
  document.title = "Delivery";
  const classes = useStyles();

  const [itemOrderPage, setItemOrderPage] = useState(true);
  const [open, setOpen] = useState(false);
  const [itemID, setItemID] = useState("");
  const [mapPage, setMapPage] = useState(false);
  const [addressPage, setAddressPage] = useState(false);
  const [getOrderDetails, setGetOrderDetails] = useState([]);
  const [deliverOrderAlert, setDeliverOrderAlert] = useState(false);


  let isLoggedState = useSelector((state) => state.delLogged);
  const dispatch = useDispatch();



  const deliverOrder = (id) => {
    setOpen(true);
    setItemID(id);
  }

  const handleClose = () => {
    setOpen(false);
  };


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

    const fetchAddressData = async () => {
      await axios
        .get("/api/deliveryAddress/", config)
        .then((res) => {
          if (!res.data.success) {
            setAddressPage(true);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchAddressData();

    const fetchMapData = async () => {
      await axios
        .get("/api/location/", config)
        .then((res) => {

          if (!res.data.success) {
            setMapPage(true);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchMapData();

    const getAllOrders = async () => {
      await axios
        .get("/api/getAllOrders/", config)
        .then((res) => {

          if (res.data.success) {
            setGetOrderDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    };
    getAllOrders();




  }, [dispatch]);

  const getAllOrders = async () => {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    await axios
      .get("/api/getAllOrders/", config)
      .then((res) => {

        if (res.data.success) {
          setGetOrderDetails(res.data.message);
          setDeliverOrderAlert(false);
        }
      })
      .catch((err) => console.log(err));
  };


  function changeOrderCompleted() {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    axios
      .get(`/api/finalDelivery/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
          setDeliverOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
          }, 3000);

        }
      })
      .catch((err) => console.log(err));
  }




  function loggedOut() {
    dispatch(delLogged(false));
    localStorage.removeItem("del-token");
  }

  if (!isLoggedState) {
    return <Redirect to="/deliveryLogin" />;
  }

  if (addressPage) {
    return <Redirect to="/delivery_address" />
  }
  if (mapPage) {
    return <Redirect to="/del_map" />
  }

  return (
    <div>
      <Navbar
        link="/deliveryLogin"
        authToken="del-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling="none"
      />
      <Grid
        container
        directio="column"
        justify="center"
        alignItems="center"
      // spacing={6}
      >
        <Grid item xs={6} className="gridsNav typo">
          <Button aria-controls="simple-menu" style={{ width: "100%" }} aria-haspopup="true" onClick={() => setItemOrderPage(true)} >Current Order<ArrowDropDownIcon /></Button>

        </Grid>

        <Grid item xs={6} className="gridsNav typo">

          <Button aria-controls="simple-menu2" style={{ width: "100%", fontSize: 15 }} aria-haspopup="true" onClick={() => setItemOrderPage(false)}>Order History<ArrowDropDownIcon /></Button>
        </Grid>
      </Grid>
      <div>
        {itemOrderPage ? <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell align="left"> Order Details</StyledTableCell>
                  <StyledTableCell align="left">Deliver</StyledTableCell>

                </TableRow>
              </TableHead>

              {deliverOrderAlert ? <Alert
                variant="filled"
                severity="success"
              >
                Order Delivered Succefully
              </Alert> : null}

              {getOrderDetails ? getOrderDetails.map((order) => (
                <TableBody key={order._id}>
                  {order.completed === false ?
                    <StyledTableRow key={order._id}>

                      <StyledTableCell >{order.TransID}</StyledTableCell>
                      <StyledTableCell ><Link to={"/delivery_order_details/" + order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
                      <StyledTableCell > <Button style={{ color: "#4F8A10", backgroundColor: "#DFF2BF" }} className="deleteBtn" onClick={() => { deliverOrder(order.TransID); }}>
                        Deliver Order
            </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    : null
                  }
                </TableBody>
              )) :
                <div></div>
              }

            </Table>
          </TableContainer>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
                Are you sure to DELIVER the order to Customer ?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No
          </Button>
              <Button onClick={() => { changeOrderCompleted(); setOpen(false); }} color="primary" autoFocus>
                Yes
          </Button>
            </DialogActions>
          </Dialog>


        </div>
          :
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Order ID</StyledTableCell>
                    <StyledTableCell align="left"> Order Details</StyledTableCell>
                    <StyledTableCell align="left">Status</StyledTableCell>

                  </TableRow>
                </TableHead>



                {getOrderDetails ? getOrderDetails.map((order) => (
                  <TableBody key={order._id}>
                    {order.completed === true ?
                      <StyledTableRow key={order._id}>

                        <StyledTableCell >{order.TransID}</StyledTableCell>
                        <StyledTableCell ><Link to={"/delivery_order_details/" + order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
                        <StyledTableCell >{order.status}
                        </StyledTableCell>
                      </StyledTableRow>
                      : <div></div>
                    }
                  </TableBody>
                )) :
                  <div></div>
                }

              </Table>
            </TableContainer>

          </div>
        }
      </div>
    </div>
  );
}
