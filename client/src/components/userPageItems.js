import React, { useState, useEffect } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { userLogged, countItems } from "../components/actions";
import jwtDecode from "jwt-decode";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Navbar from "./userNavbar";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Popover } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

const theme = createMuiTheme({
  typography: {
    fontFamily: '-apple-system',
  },
  palette: {
    primary: { main: "#363f4f" },
    secondary: {
      main: "#fe4a49",
    },
  },
});


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "#36454f",
    width: "100%",

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
}));

export default function UserPageItems({ match }) {
  document.title = "Swiggy";
  const classes = useStyles();
  const [getDetails, setGetDetails] = useState([]);
  const [getRestDetails, setGetRestDetails] = useState([]);
  const [cartItemsMsg, setCartItemsMsg] = useState("Loading...");
  const [open, setOpen] = useState(false);
  const [deleteAndUpdateCart, setDeleteAndUpdateCart] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [switchBtn, setSwitchBtn] = useState(false);


  let isLoggedState = useSelector((state) => state.userLogged);
  let countItems1 = useSelector((state) => state.countItems);
  const dispatch = useDispatch();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (event) => {
    setSwitchBtn(event.target.checked);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;


  const handleClose = () => {
    setOpen(false);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const onlyVeg = (checked) => {

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    if (checked) {
      axios
        .get("api/restaurants/" + match.params.id, config)
        .then((res) => {

          if (res.data.success) {
            let vegItems = res.data.message.map((item) => (
              item.veg ? item : null
            ));
            setGetDetails(vegItems);
          }
        })
        .catch((err) => console.log(err));
    }
    else {
      axios
        .get("api/restaurants/" + match.params.id, config)
        .then((res) => {

          if (res.data.success) {
            setGetDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
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
      .get("api/restaurants/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
          setGetDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("api/restaurant/" + match.params.id, config)
      .then((res) => {

        if (res.data.success) {
          setGetRestDetails(res.data.message);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("api/cart/", config)
      .then((res) => {
        if (res.data.success) {

          dispatch(countItems(res.data.message));
        }
      })
      .catch((err) => console.log(err));

  }, [dispatch, match.params]);

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

  const incBtn = (iid) => {

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };

    axios
      .get("api/cart/" + match.params.id + "/" + iid + "/add", config)
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

  const decBtn = (iid) => {
    

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    };
    axios
      .get("api/cart/" + match.params.id + "/" + iid + "/sub", config)
      .then((res) => {
        
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
          console.log(res.data.message)
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

  return (
    <div className={classes.body}>
      <Navbar
        link="/"
        authToken="user-token"
        loggedOut={loggedOut}
        disabling=""
        homeDisabling=""
      />
      <ThemeProvider theme={theme}>
        <div align="center">
          <div>
            <Typography variant="h2" style={{ color: "#FFFFFF" }} component="p">
              {getRestDetails.restaurantName}
            </Typography><br />
            <Typography variant="h6" style={{ color: "#FFFFFF" }} component="p">
              {getRestDetails.restaurantDescription}
            </Typography>
            <br />
            <Typography style={{ color: "#fe4a49", fontWeight: "bold" }}>VEG ONLY</Typography> 

            <Switch
              checked={switchBtn}
              onChange={handleChange}
              onClick={(event) => onlyVeg(event.target.checked)}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              color="secondary"
            />
            <br />
            <hr style={{ color: "#FFFFFF", backgroundColor: "#FFFFFF" }} /><br />
          </div>

          <Grid container spacing={3}>

            {getDetails ? getDetails.map((restaurant) => (

              restaurant ?

                <Grid item xs={4} key={restaurant._id} className={classes.typography}>

                  <Card className={classes.root}>

                    <CardMedia
                      className={classes.media}
                      image={restaurant.itemImage ? `uploads/${restaurant.itemImage}` : ""}

                    />
                    {restaurant.veg ?
                      <img width="15" height="15" alt="veg" src={require("./veg-icon.png")}></img>
                      : <img width="15" height="15" alt="non_veg" src={require("./non-veg-icon.png")}></img>}
                    <CardHeader

                      style={{ fontWeight: "bold" }}
                      aria-label="recipe"
                      title={restaurant.itemName ? restaurant.itemName : ""}

                    >
                    </CardHeader>
                    <CardContent>
                      <Typography style={{ color: "#696969" }} variant="h6" component="p">
                        {restaurant.itemDescription}
                      </Typography><br />
                      <Grid container>
                        <Grid item xs align="left" style={{ align: "left" }}>
                          <div style={{ color: "#000000", fontWeight: "bold" }}><img width="15" alt="price" height="15" src="https://image.flaticon.com/icons/svg/25/25473.svg" />{restaurant.itemPrice}
                          </div>
                        </Grid>
                        <Grid item>
                          <div>
                            <Button onClick={(event) => { incBtn(restaurant._id); handleClick(event); }}><AddIcon /></Button>
                            {countItems1.map((item, key) => (
                              item._id === restaurant._id ?
                                <div key={item._id} style={{ fontWeight: "bold" }}>
                                  {item.count}
                                </div> : null
                            ))}
                            <Button onClick={(event) => { decBtn(restaurant._id); handleClick(event) }}><RemoveIcon /></Button>
                          </div>

                        </Grid>
                      </Grid>
                    </CardContent>


                  </Card>
                </Grid>

                : null
            )) : null}
          </Grid>
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
