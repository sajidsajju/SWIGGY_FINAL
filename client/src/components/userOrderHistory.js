import React, { useState, useEffect } from "react";
import {
  makeStyles,
  withStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { userLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
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
import Navbar from "./userNavbar";

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
  body: {
    backgroundColor: "#36454f",
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
  },
  emptyCart: {
    fontSize: "20px",
    fontWeight: "bold",
    align: "center",

  }
}));

export default function UserOrderHistory({ match }) {
  document.title = "Swiggy Cart";
  const classes = useStyles();
  const [getOrderDetails, setGetOrderDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemID, setItemID] = useState("");
  const [cancelOrderAlert, setCancelOrderAlert] = useState(false);

  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();


  const cancelOrder = (id) => {
    setOpen(true);
    setItemID(id);
  }
  const handleClose = () => {
    setOpen(false);
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

    const orders = async () => {
      await axios
        .get("/api/getAllOrders/", config)
        .then((res) => {

          if (res.data.success) {
            setGetOrderDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));

    };
    orders();
  }, [dispatch]);

  const getAllOrders = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    await axios
      .get("/api/getAllOrders/", config)
      .then((res) => {

        if (res.data.success) {
          setGetOrderDetails(res.data.message);
          setCancelOrderAlert(false);
        }
      })
      .catch((err) => console.log(err));
  };


  function cancelOrderStatus() {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get(`/api/cancelOrder/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.message)
          setCancelOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
          }, 3000);


        }
      })
      .catch((err) => console.log(err));
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
        cartDisabling=""
        ordersDisabling="none"
      />

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell align="left"> Order Details</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">Cancel</StyledTableCell>

            </TableRow>
          </TableHead>
          {cancelOrderAlert ? <Alert
            variant="filled"
            severity="info"
          >
            Order Cancelled
              </Alert> : null}
              <TableBody>
          {getOrderDetails ? getOrderDetails.map((order, key) => (
            
              <StyledTableRow key={order._id}>

                <StyledTableCell >{order.TransID}</StyledTableCell>
                <StyledTableCell ><Link to={"/order_details/" + order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
                <StyledTableCell >{order.status}
                </StyledTableCell>
                <StyledTableCell ><div>{order.completed ? <div>Closed</div> : <Button style={{ color: "#D8000C", backgroundColor: "#FFD2D2" }} className="deleteBtn" onClick={() => { cancelOrder(order.TransID); }}>
                  Cancel Order
            </Button>}
                </div>
                </StyledTableCell>

              </StyledTableRow>

            
          )) :
            <div></div>
          }
          </TableBody>
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
            Are you sure to CANCEL the order ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={() => { cancelOrderStatus(); setOpen(false); }} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
