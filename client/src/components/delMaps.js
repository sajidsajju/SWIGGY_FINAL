import React, { useState, useEffect } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "./maps.css";
import Button from "@material-ui/core/Button";
import { usePosition } from "./Map";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import { delLogged } from "../components/actions";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII",
  iconSize: [25, 41],
  iconAnchor: [12.5, 43],
  popupAnchor: [0, -41],
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: {
      main: "#002984",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#33A1DE",
  },
}));

function Maps() {
  document.title = "Location";
  const classes = useStyles();
  const [location, setLocation] = useState([15.8281, 78.0373]);
  const [back, setBack] = useState(false);
  const [open, setOpen] = useState(false);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { latitude, longitude } = usePosition();


  const moving = React.useCallback((event) => {
    setLocation([event.latlng.lat, event.latlng.lng]);

  }, []);


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

    const ltd = 15.8281;
    const long = 78.0373;
    const newLatitude = latitude ? latitude : ltd;
    const newLongitude = longitude ? longitude : long;

    setLocation([newLatitude, newLongitude]);
  }, [dispatch, latitude, longitude]);



  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("latitude", location[0]);
    formData.append("longitude", location[1]);

    const config = {
      headers: {
        "content-type": "application/json-data",
        Authorization: "Bearer " + localStorage.getItem("del-token"),
      },
    };
    axios
      .post(`/api/location/${location[0]}/${location[1]}`, formData, config)
      .then((res) => {

        if (res.data.success) {
          handleClickOpen();
          setTimeout(() => {
            handleClose();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));

  }

  if (back) {
    return <Redirect to="/delivery_home" />
  }
  if (!isLoggedState) {
    return <Redirect to="/deliveryLogin" />;
  }
  return (
    <div>

      <div className="mapdiv">

        <ThemeProvider theme={theme}>
          <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={6} className="location">
            <Grid item xs={6}>
              <form type="submit" onSubmit={handleSubmit} className="location">
                <Button type="submit" className={classes.submit} color="primary">
                  Confirm Location
                </Button>

              </form>
            </Grid>
            <Grid item xs={6}>
              <Button className={classes.submit} color="primary" onClick={() => { setBack(true) }}>
                Back
                </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
        <Map className="map" center={location} zoom={15} onClick={moving}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} icon={myIcon}>
            <Popup>
              My Location
            </Popup>
          </Marker>
        </Map>
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
            Location Saved Successfully
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Maps;
