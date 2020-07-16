import React, { useState, useEffect } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { userLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";
import Navbar from "./userNavbar";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "#36454f",
    height: "100%",
    minHeight: "100vh"
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
    backgroundColor: "#8C001A",    //red[500],
    color: "#FFFFFF"
  },
  carousel: {
    width: "50%",
    // height: "20%"
  }
}));

export default function UserPage() {
  document.title = "Swiggy";
  const classes = useStyles();
  const [getDetails, setGetDetails] = useState([]);
  const [userData, setUserData] = useState(true);

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

    const fetchData = () => {
      axios
        .get("api/restaurants/", config)
        .then((res) => {
          if (res.data.success) {
            setGetDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();

    const fetchUser = () => {
      axios
        .get("api/userDetails/", config)
        .then((res) => {

          if (res.data.success) {
            setUserData(false);
          }

        })
        .catch((err) => console.log(err));
    }
    fetchUser();


  }, [dispatch]);


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
        homeDisabling="none"
      />
      <ThemeProvider theme={theme}>
        <div align="center">
          <br />
          {userData ?

            <Alert
              variant="filled"
              severity="info"
            >
              Update User Address & Location to proceed.
</Alert>
            :
            <div>
              <Carousel className={classes.carousel}>
                <div>
                  <img alt="non_veg" src={require("./chicken.jpg")} />
                  <p className="legend">Non Veg</p>
                </div>
                <div>
                  <img alt="veg" src={require("./veg.jpg")} />
                  <p className="legend">Pure Veg</p>
                </div>
                <div>
                  <img alt="ice" src={require("./icecream.jpg")} />
                  <p className="legend">Ice Creams</p>
                </div>
              </Carousel>
              <br />
              <hr style={{ color: "#FFFFFF", backgroundColor: "#FFFFFF" }} /><br />
              <Grid container spacing={3}>
                {getDetails ? getDetails.map((restaurant, key) => (

                  restaurant.restaurantAddress ?

                    <Grid item xs={4} key={restaurant._id}>

                      <Link to={"/home_user/items/" + restaurant._id + "/"} style={{ textDecoration: "none" }}>
                        <Card className={classes.root} key={restaurant._id} style={{ cursor: "pointer" }}>

                          <CardMedia
                            className={classes.media}
                            image={restaurant.restaurantAddress ? `uploads/${restaurant.restaurantAddress.profileImage}` : ""}

                          />
                          <CardHeader

                            style={{ fontWeight: "bold" }}
                            aria-label="recipe"
                            title={restaurant.restaurantAddress ? restaurant.restaurantAddress.restaurantName : ""}

                          />
                          <CardContent>
                            <Typography style={{ color: "#696969" }} variant="h6" component="p">
                              {restaurant.restaurantAddress.restaurantDescription}
                            </Typography>
                          </CardContent>
                          <CardActions disableSpacing>

                          </CardActions>

                        </Card>
                      </Link>
                    </Grid>

                    : null
                )) : null}
              </Grid>
            </div>

          }
        </div>
      </ThemeProvider>
    </div>
  );
}
