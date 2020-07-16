import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import {
  makeStyles,
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Fab, Grid } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { orange } from "@material-ui/core/colors";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "../components/forms/loginErrors";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { restLogged } from "../components/actions";
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
import TablePagination from '@material-ui/core/TablePagination';


const validationSchema = Yup.object({
  itemName: Yup.string().min(6).max(30).required(),
  itemDescription: Yup.string().min(6).max(50).required(),
  itemPrice: Yup.string().required(),
  Veg: Yup.boolean().required(),
});
const theme = createMuiTheme({
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

export default function RestProducts() {
  document.title = "Restaurant";
  // const history = useHistory();
  const classes = useStyles();
  const [dataError, setDataError] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [errorDisp, setErrorDisp] = useState("none");
  const [successDisp, setSuccessDisp] = useState("none");
  const [dataSuccess, setDataSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [getDetails, setGetDetails] = useState([]);
  const [disp, setDisp] = useState("none");
  const [itemOrOrderPage, setItemOrOrderPage] = useState(true);
  const [addItemsPage, setAddItemsPage] = useState(true);
  const [itemOrderPage, setItemOrderPage] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  const [deleteItemInfo, setDeleteItemInfo] = useState("");
  const [deleteItemDisp, setDeleteItemDisp] = useState("none");
  const [deleteItemInfoDisp, setDeleteItemInfoDisp] = useState("none");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteID, setDeleteID] = useState("");
  const [itemID, setItemID] = useState("");
  const [mapPage, setMapPage] = useState(false);
  const [addressPage, setAddressPage] = useState(false);
  const [getOrderDetails, setGetOrderDetails] = useState([]);
  const [deliverOrderAlert, setDeliverOrderAlert] = useState(false);
  const [cancelOrderAlert, setCancelOrderAlert] = useState(false);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(+event.target.value));
    setPage(0);
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setDeleteID(id);
  };
  const deliverOrder = (id) => {
    setOpen(true);
    setItemID(id);
  }

  const cancelOrder = (id) => {
    setOpen1(true);
    setItemID(id);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const menuHandleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const menuHandleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  }


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
        .get("api/items/", config)
        .then((res) => {
          if (res.data.success) {
            setGetDetails(res.data.message);

            setDeleteItemInfoDisp("none");
          }
          if (!res.data.success) {
            setDeleteItemInfo(res.data.message);
            setDeleteItemInfoDisp("");
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();


    const fetchMapData = async () => {
      await axios
        .get("api/location/", config)
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
        .get("api/getAllOrders/", config)
        .then((res) => {

          if (res.data.success) {
            setGetOrderDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    };
    getAllOrders();

    const fetchAddressData = async () => {
      await axios
        .get("api/restaurantAddress/", config)
        .then((res) => {

          if (!res.data.success) {
            setAddressPage(true);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchAddressData();

  }, [dispatch]);

  const getViewData = async () => {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };

    await axios
      .get("api/items/", config)
      .then((res) => {
        if (res.data.success) {
          setGetDetails(res.data.message);

          setDeleteItemInfoDisp("none");
        }
        if (!res.data.success) {
          setDeleteItemInfo(res.data.message);
          setDeleteItemInfoDisp("");
        }
      })
      .catch((err) => console.log(err));
  }
  getViewData();


  const getAllOrders = async () => {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };
    await axios
      .get("api/getAllOrders/", config)
      .then((res) => {

        if (res.data.success) {
          setGetOrderDetails(res.data.message);
          setDeliverOrderAlert(false);
          setCancelOrderAlert(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const currentPage = getDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function deleteOnClick() {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };
    axios
      .delete(`api/items/${deleteID}`, config)
      .then((res) => {
        if (res.data.success) {
          setDeleteItem(res.data.message);
          setDeleteItemDisp("");
          setTimeout(() => {
            setDeleteItemDisp("none");
          }, 5000);
          getViewData();
        }
        if (!res.data.success) {
          setDeleteItemInfo(res.data.message);
          setDeleteItemInfoDisp("");
        }
      })
      .catch((err) => console.log(err));
  };

  function changeOrderCompleted() {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };
    axios
      .get(`api/changeOrderStatus/${itemID}`, config)
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

  function cancelOrderStatus() {
    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("rest-token"),
      },
    };
    axios
      .get(`api/cancelOrder/${itemID}`, config)
      .then((res) => {
        if (res.data.success) {
          setCancelOrderAlert(true);
          setTimeout(() => {
            getAllOrders();
          }, 3000);


        }
      })
      .catch((err) => console.log(err));
  }


  function loggedOut() {
    dispatch(restLogged(false));
    localStorage.removeItem("rest-token");
  }

  function onchangeImage(e) {
    setDisp("");
    setSelectedFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageError(false);

  }
  if (!isLoggedState) {
    return <Redirect to="/restaurantLogin" />;
  }
  if (mapPage) {
    return <Redirect to="/map" />
  }
  if (addressPage) {
    return <Redirect to="/restaurant_address" />
  }

  return (
    <div>
      <Navbar
        link="/restaurantLogin"
        authToken="rest-token"
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
          <Button aria-controls="simple-menu" style={{ width: "100%" }} aria-haspopup="true" onClick={menuHandleClick}>Items<ArrowDropDownIcon /></Button>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            id="simple-menu"
            keepMounted

            open={Boolean(anchorEl)}
            onClose={() => { setAnchorEl(null) }}
          >
            <MenuItem onClick={() => { setItemOrOrderPage(true); setAddItemsPage(true); setAnchorEl(null) }}>
              Add Items
                </MenuItem>
            <MenuItem onClick={() => { setItemOrOrderPage(true); setAddItemsPage(false); setAnchorEl(null) }}>View Items</MenuItem>
          </Menu>
        </Grid>

        <Grid item xs={6} className="gridsNav typo">

          <Button aria-controls="simple-menu2" style={{ width: "100%", fontSize: 15 }} aria-haspopup="true" onClick={menuHandleClick2}>Orders<ArrowDropDownIcon /></Button>
          <Menu
            anchorEl={anchorEl2}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            id="simple-menu2"
            keepMounted

            open={Boolean(anchorEl2)}
            onClose={() => { setAnchorEl2(null) }}
          >
            <MenuItem onClick={() => { setItemOrOrderPage(false); setItemOrderPage(true); setAnchorEl2(null) }}>
              Orders
                </MenuItem>
            <MenuItem onClick={() => { setItemOrOrderPage(false); setItemOrderPage(false); setAnchorEl2(null) }}>Order History</MenuItem>
          </Menu>
        </Grid>

      </Grid>
      {itemOrOrderPage ? (
        <div>
          {addItemsPage ? (
            <div>
              <Formik
                initialValues={{
                  itemName: "",
                  itemDescription: "",
                  itemPrice: "",
                  Veg: "false",
                }}
                enableReinitialize="true"
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  if (image === "") {
                    setImageError(true);
                    setSubmitting(false);
                  } else {
                    setImageError(false);

                    const formData = new FormData();

                    formData.append("itemImage", selectedFile);

                    formData.append("itemName", values.itemName);
                    formData.append("itemDescription", values.itemDescription);
                    formData.append("itemPrice", values.itemPrice);
                    formData.append("Veg", values.Veg);

                    const config = {
                      headers: {
                        "content-type": "application/json-data",
                        Authorization:
                          "Bearer " + localStorage.getItem("rest-token"),
                      },
                    };

                    axios
                      .post(
                        "api/items/",
                        formData,
                        config
                      )
                      .then((res) => {
                        if (!res.data.success) {
                          setSubmitting(false);
                          setDataSuccess("");
                          setSuccessDisp("none");
                          setErrorDisp("");
                          setDataError(res.data.message);
                          setTimeout(() => {
                            setErrorDisp("none");
                          }, 10000);
                        }
                        if (res.data.success) {
                          setSubmitting(true);
                          setDataError("");
                          setErrorDisp("none");
                          setSuccessDisp("");
                          setDataSuccess(res.data.message);
                          setSelectedFile("");
                          setImage("");
                          setDisp("none");
                          values.itemName = "";
                          values.itemDescription = "";
                          values.itemPrice = "";
                          values.Veg = "false";
                          setSubmitting(false);
                          setTimeout(() => {
                            setSuccessDisp("none");
                          }, 5000);
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  isSubmitting,
                  handleBlur,
                  touched,
                }) => (
                    <ThemeProvider theme={theme}>
                      <div className={classes.paper}>
                        <Typography component="h1" variant="h5" align="center">
                          Add Items
                        <hr
                            style={{
                              backgroundColor: "black",
                              height: 1,
                              width: 600,
                            }}
                          />
                        </Typography>
                        <Alert
                          variant="filled"
                          severity="error"
                          style={{ display: errorDisp }}
                        >
                          {dataError}
                        </Alert>

                        <Alert
                          variant="filled"
                          severity="success"
                          style={{ display: successDisp }}
                        >
                          {dataSuccess}
                        </Alert>
                        <form className={classes.form} onSubmit={handleSubmit}>
                          <div align="center">
                            <label htmlFor="itemImage">
                              <input
                                style={{ display: "none" }}
                                accept="image/x-png,image/jpeg"
                                id="itemImage"
                                type="file"
                                onChange={onchangeImage}
                              //   required
                              />
                              <Fab
                                color="primary"
                                size="small"
                                component="span"
                                aria-label="add"
                                variant="extended"
                              >
                                Item Image
                              <AddCircle />
                              </Fab>
                            </label>
                            <br />
                            <br />
                            <div
                              style={{ width: 150, height: 150, display: disp }}
                            >
                              <Image disableSpinner={true} src={image} />
                            </div>
                            {/* <Avatar src={image} /> */}
                          </div>
                          <div>
                            {imageError ? (
                              <div align="center" style={{ color: "#d8000c" }}>
                                Image is Required
                              </div>
                            ) : null}
                          </div>
                          <Grid
                            container
                            directio="column"
                            justify="center"
                            alignItems="center"
                            spacing={6}
                          >
                            <Grid item xs={6}>
                              <TextField
                                // variant="outlined"
                                margin="normal"
                                // required
                                fullWidth
                                id="itemName"
                                label="Item Name"
                                name="itemName"
                                type="text"
                                value={values.itemName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="itemName"
                                autoFocus
                              />
                              <div>
                                <Error
                                  touched={touched.itemName}
                                  message={errors.itemName}
                                />
                              </div>
                              <TextField
                                // variant="outlined"
                                margin="normal"
                                // required
                                fullWidth
                                name="itemDescription"
                                label="Item Description"
                                type="text"
                                id="itemDescription"
                                autoComplete="itemDescription"
                                value={values.itemDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div>
                                <Error
                                  touched={touched.itemDescription}
                                  message={errors.itemDescription}
                                />
                              </div>
                              <TextField
                                // variant="outlined"
                                margin="normal"
                                // required
                                fullWidth
                                name="itemPrice"
                                label="Item Price"
                                type="number"
                                id="itemPrice"
                                autoComplete="itemPrice"
                                value={values.itemPrice}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <div>
                                <Error
                                  touched={touched.itemPrice}
                                  message={errors.itemPrice}
                                />
                              </div>
                              <FormControl className={classes.formControl}>
                                <InputLabel id="Veg">Veg ?</InputLabel>
                                <Select
                                  labelId="Veg"
                                  id="Veg"
                                  name="Veg"
                                  autoComplete="Veg"
                                  value={values.Veg}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  style={{ width: 100 }}
                                >
                                  <MenuItem value={true}>Veg</MenuItem>
                                  <MenuItem value={false}>Non-Veg</MenuItem>
                                </Select>
                              </FormControl>
                              <div>
                                <Error
                                  touched={touched.Veg}
                                  message={errors.Veg}
                                />
                              </div>
                            </Grid>
                          </Grid>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isSubmitting}
                          >
                            Save Item
                        </Button>
                        </form>
                      </div>
                    </ThemeProvider>
                  )}
              </Formik>
            </div>
          ) :
            <div>
              <Alert
                variant="filled"
                severity="success"
                style={{ display: deleteItemDisp }}
              >
                {deleteItem}
              </Alert>

              <Alert
                variant="filled"
                severity="info"
                style={{ display: deleteItemInfoDisp }}
              >
                {deleteItemInfo}
              </Alert>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Item Image</StyledTableCell>
                      <StyledTableCell align="right">Item Name</StyledTableCell>
                      <StyledTableCell align="right">Item Description</StyledTableCell>
                      <StyledTableCell align="right">Item Price</StyledTableCell>
                      <StyledTableCell align="right">Veg ?</StyledTableCell>
                      <StyledTableCell align="right">Edit/Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPage ? currentPage.map((row) => (

                      <StyledTableRow key={row._id}>
                        <StyledTableCell component="th" scope="row">
                          <div style={{ width: 50, height: 50 }}>
                            <Image alt={row.itemName} src={`uploads/${row.itemImage}`}></Image>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.itemName}</StyledTableCell>
                        <StyledTableCell align="right">{row.itemDescription}</StyledTableCell>
                        <StyledTableCell align="right">{row.itemPrice}</StyledTableCell>
                        <StyledTableCell align="right">{row.veg === true ? "Veg" : "Non-Veg"}</StyledTableCell>
                        <StyledTableCell align="right"><Link to={"restaurant_items/edit/" + row.uid + "/" + row._id} style={{ textDecoration: "none" }}>Edit &nbsp;&nbsp;&nbsp;</Link>  <br />
                          <Button className="deleteBtn" onClick={() => { handleClickOpen(row._id); }}>
                            Delete
      </Button></StyledTableCell>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description" style={{ color: "#000000" }}>
                              Are you sure to DELETE the Item ?
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



                      </StyledTableRow>
                    )) : (<div>
                    </div>
                      )}
                  </TableBody>
                </Table>

              </TableContainer>
              <TablePagination
                component="div"
                count={getDetails.length}
                page={page}
                onChangePage={handleChangePage}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          }
        </div>
      ) :
        <div>
          {itemOrderPage ?
            <div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Order ID</StyledTableCell>
                      <StyledTableCell align="left"> Order Details</StyledTableCell>
                      <StyledTableCell align="left">Deliver</StyledTableCell>
                      <StyledTableCell align="left">Cancel</StyledTableCell>

                    </TableRow>
                  </TableHead>

                  {deliverOrderAlert ? <Alert
                    variant="filled"
                    severity="success"
                  >
                    Order Delivered Succefully
              </Alert> : null}

                  {cancelOrderAlert ? <Alert
                    variant="filled"
                    severity="info"
                  >
                    Order Cancelled
              </Alert> : null}
                  {getOrderDetails ? getOrderDetails.map((order) => (
                    <TableBody key={order._id}>
                      {order.completed === false ?
                        <StyledTableRow key={order._id}>

                          <StyledTableCell >{order.TransID}</StyledTableCell>
                          <StyledTableCell ><Link to={"/restaurant_order_details/" + order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
                          <StyledTableCell > <Button style={{ color: "#4F8A10", backgroundColor: "#DFF2BF" }} className="deleteBtn" onClick={() => { deliverOrder(order._id); }}>
                            Deliver Order
            </Button>
                          </StyledTableCell>
                          <StyledTableCell ><Button style={{ color: "#D8000C", backgroundColor: "#FFD2D2" }} className="deleteBtn" onClick={() => { cancelOrder(order.TransID); }}>
                            Cancel Order
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
                    Are you sure to DELIVER the order ?
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

              <Dialog
                open={open1}
                onClose={handleClose1}
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
                  <Button onClick={handleClose1} color="primary">
                    No
          </Button>
                  <Button onClick={() => { cancelOrderStatus(); setOpen1(false); }} color="primary" autoFocus>
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
                          <StyledTableCell ><Link to={"/restaurant_order_details/" + order._id} style={{ textDecoration: "none" }}>Click here for order details</Link>  </StyledTableCell>
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

      }
    </div>
  );
}
