import React, { useEffect, useState } from "react";
import {
  fade,
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Redirect } from "react-router-dom";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Avatar, Grid } from "@material-ui/core";
import axios from "axios";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';


const theme = createMuiTheme({
  palette: {
    primary: { main: "#36454f" },
    secondary: {
      main: "#002984",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Navbar({ link, authToken, loggedOut, disabling, homeDisabling }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [restAddress, setRestAddress] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [getDetails, setGetDetails] = useState({});
  const [locationRoute, setLocationRoute] = useState(false);
  const [home, homePage] = useState(false);



  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json-data",
        "Authorization": "Bearer " + localStorage.getItem("rest-token"),
      }
    }
    axios.get("/api/restaurantAddress/",
      config)
      .then((res) => {

        if (res.data.success) {
          setGetDetails(
            res.data.message
          );
        }
      })
      .catch((err) => console.log(err))
  }, []);


  const closingMenu = () => {
    setAnchorEl(null);
    setRestAddress(true);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    setAnchorEl(null);
    loggedOut();


  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={closingMenu} style={{ display: disabling }}>
        My account
      </MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            alt={getDetails.restaurantName} src={getDetails.profileImage ? `/uploads/${getDetails.profileImage}` : ""}
          />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  if (restAddress) {
    return <Redirect to="/restaurant_address" />;
  }

  if (locationRoute) {
    return <Redirect to="/map" />;
  }

  if (home) {
    return <Redirect to="/restaurant" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>

            <Grid container justify="center"
              alignItems="center"
              spacing={6}>
              <Grid item xs={6}>
                <IconButton onClick={() => { homePage(true) }} style={{ display: homeDisabling, backgroundColor: "#FFFFFF" }}>
                  <HomeRoundedIcon color="inherit" />
                </IconButton>
              </Grid>

              <Grid item xs={6}>
                <IconButton onClick={() => { setLocationRoute(true) }} style={{ backgroundColor: "#FFFFFF" }}>
                  <MyLocationIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt={getDetails.restaurantName} src={getDetails.profileImage ? `/uploads/${getDetails.profileImage}` : ""}
                />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </ThemeProvider>
  );
}
