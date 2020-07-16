import React, { useState, useEffect } from "react";
import {
  makeStyles,
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { userLogged, countItems, total } from "../components/actions";
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
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Popover } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: '-apple-system',
  },
  palette: {
    primary: { main: "#363f4f" },
    secondary: {
      main: "#002984",
    },
  },
});

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
  payColor: {
    color: "#FFFFFF"
  },
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
  table1: {
    minWidth: 100,
    width : 70,
    paddingRight: "30%"
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

export default function UserCart({ match }) {
  document.title = "Swiggy Cart";
  const classes = useStyles();
  const [cartItemsMsg, setCartItemsMsg] = useState("Loading...");
  const [open, setOpen] = useState(false);
  const [deleteAndUpdateCart, setDeleteAndUpdateCart] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [redirectToPayment, setRedirectToPayment] = useState(false);

  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  const dispatch = useDispatch();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const subTotal = () => {
    let total1 = 0;

    countItems1.map((item) => (
      total1 = total1 + parseInt(item.count * item.itemPrice)
    ));

    dispatch(total((total1 + total1 * 0.07).toFixed(2)));
    return total1;
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
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

  }, [dispatch]);

  const getCartData = () => {

    const config = {
      headers: {
        "content-type": "application/json-data",
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

  }

  const incBtn = (rid, iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get("api/cart/" + rid + "/" + iid + "/add", config)
      .then((res) => {
        if (res.data.success) {
          getCartData();
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
        if (!res.data.success && res.data.dialog) {
          setAnchorEl(null);
          setDeleteAndUpdateCart({
            message: res.data.message,
            uid: res.data.uid,
            id: res.data.id,
          });
          handleClickOpen();

        }
        if (!res.data.success && !res.data.dialog) {
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };

  const decBtn = (rid, iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    axios
      .get("api/cart/" + rid + "/" + iid + "/sub", config)
      .then((res) => {
        console.log(res.data)
        if (res.data.success) {
          getCartData();
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
        if (!res.data.success) {
          setCartItemsMsg(res.data.message);
          setTimeout(() => {
            setCartItemsMsg("Loading...");
            setAnchorEl(null);
          }, 2000);
        }
      })
      .catch((err) => console.log(err));

  }

  function deleteOnClick() {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios.get(`api/cart/${deleteAndUpdateCart.uid}/${deleteAndUpdateCart.id}`, config)
      .then((res) => {
        if (res.data.success) {
          getCartData();
        }
      })
      .catch((err) => console.log(err));
  };

  function loggedOut() {
    dispatch(userLogged(false));
    localStorage.removeItem("user-token");
  }
  if (!isLoggedState) {
    return <Redirect to="/" />;
  }
  if (redirectToPayment) {
    return <Redirect to="payments" />;
  }

  return (
    <div className={classes.body}>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
        cartDisabling="none"
      />

      <ThemeProvider theme={theme}>

        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Item Image</StyledTableCell>
                  <StyledTableCell >Item Name</StyledTableCell>
                  <StyledTableCell >Item Price</StyledTableCell>
                  <StyledTableCell >Quantity</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {countItems1.map((item, key) => (

                  <StyledTableRow key={item._id}>

                    <StyledTableCell component="th" scope="row">
                      <div style={{ width: 50, height: 50 }}>
                        <Image alt={item.itemName} src={`uploads/${item.itemImage}`}></Image>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell style={{ color: "#000000", fontWeight: "bold", fontSize: "20px" }}>{item.itemName}</StyledTableCell>
                    <StyledTableCell ><div>
                      <Button onClick={(event) => { incBtn(item.rid, item._id); handleClick(event); }}><AddIcon /></Button>

                      <div key={item._id} style={{ fontWeight: "bold" }}>
                        {item.count}
                      </div>

                      <Button onClick={(event) => { decBtn(item.rid, item._id); handleClick(event) }}><RemoveIcon /></Button>
                    </div>
                    </StyledTableCell>
                    <StyledTableCell ><div style={{ color: "#000000", fontWeight: "bold" }}><img width="15" alt="$" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{item.itemPrice * item.count}
                    </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                 </TableBody>
            </Table>
                {/* <br /><br /><br /> */}
                {countItems1[0] === undefined ? <Alert
                  variant="filled"
                  severity="info"
                >
                  Empty Cart
              </Alert>
                  :
                  <Table className={classes.table1} >
                  <TableBody align="right" style={{ paddingLeft: "170%" }}>
                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={2} className={classes.totalStylesNames}>Subtotal</TableCell>
                      <TableCell align="right" className={classes.totalStyles}>{subTotal().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={1} className={classes.totalStylesNames}>Tax</TableCell>
                      <TableCell align="right" className={classes.totalStyles}>7%</TableCell>
                      <TableCell align="right" className={classes.totalStyles}>{(subTotal() * 0.07).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className={classes.totalStylesNames}>Total</TableCell>
                      <TableCell align="right" className={classes.totalStyles}>{(subTotal() + subTotal() * 0.07).toFixed(2)}</TableCell>
                    </TableRow>
                    </TableBody>
                  </Table>
                }
             

          </TableContainer>

        </div>
        {countItems1[0] === undefined ? null :
          <div align="center">
            <Button
              // fullWidth
              align="center"
              variant="contained"
              color="secondary"
              className={classes.submit}
              style={{ backgroundColor: "#fe4a49", color: "#FFFFFF" }}
              onClick={() => { setRedirectToPayment(true) }}
            >
              Proceed To Pay
                </Button>
            <br /><br /><br />
          </div>
        }
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
              {deleteAndUpdateCart.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
          </Button>
            <Button onClick={() => { deleteOnClick(); setOpen(false); }} color="primary" autoFocus>
              Yes
          </Button>
          </DialogActions>
        </Dialog>
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.typography}>{cartItemsMsg}</Typography>
        </Popover>
      </ThemeProvider>
    </div>
  );
}
