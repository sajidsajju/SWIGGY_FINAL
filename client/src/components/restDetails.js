import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Navbar from "./navbar";
import {
  makeStyles,
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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { restLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";

const validationSchema = Yup.object({
  restaurantName: Yup.string().min(6).required(),
  restaurantDescription: Yup.string().min(6).required(),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number is not valid")
    .required(),
  address: Yup.string().min(10).required(),
  landmark: Yup.string().min(6).required(),
  openFrom: Yup.string().required(),
  openTill: Yup.string().required(),
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#36454f" },
    secondary: {
      main: "#002984",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
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
}));

export default function RestDetails() {
  document.title = "Restaurant Address";
  const classes = useStyles();
  const [dataError, setDataError] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [errorDisp, setErrorDisp] = useState("none");
  const [successDisp, setSuccessDisp] = useState("none");
  const [dataSuccess, setDataSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [getDetails, setGetDetails] = useState({});

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
        .get("/api/restaurantAddress/", config)
        .then((res) => {
          if (res.data.success) {
            setGetDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();

  }, [dispatch]);

  function loggedOut() {
    dispatch(restLogged(false));
    localStorage.removeItem("rest-token");
  }

  function onchangeImage(e) {
    setSelectedFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageError(false);
  }
  if (!isLoggedState) {
    return <Redirect to="/restaurantLogin" />;
  }
  return (
    <div>
      <Navbar
        link="/restaurantLogin"
        authToken="rest-token"
        loggedOut={loggedOut}
        disabling="none"
      />

      <Formik
        initialValues={{
          restaurantName: getDetails.restaurantName ? getDetails.restaurantName : "",
          restaurantDescription: getDetails.restaurantDescription ? getDetails.restaurantDescription : "",
          phone: getDetails.phone ? getDetails.phone : "",
          address: getDetails.address ? getDetails.address : "",
          landmark: getDetails.landmark ? getDetails.landmark : "",
          openFrom: getDetails.openFrom ? getDetails.openFrom : "",
          openTill: getDetails.openTill ? getDetails.openTill : "",
          openTomorrow: getDetails.openTomorrow ? getDetails.openTomorrow : false,
        }}
        enableReinitialize="true"
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (image === "" && !getDetails.profileImage) {
            setImageError(true);
          } else {
            setImageError(false);


            const formData = new FormData();

            if (image !== "") {
              formData.append("profileImage", selectedFile);
            }

            formData.append("restaurantName", values.restaurantName);
            formData.append(
              "restaurantDescription",
              values.restaurantDescription
            );
            formData.append("phone", values.phone);
            formData.append("address", values.address);
            formData.append("landmark", values.landmark);
            formData.append("openFrom", values.openFrom);
            formData.append("openTill", values.openTill);
            formData.append("openTomorrow", values.openTomorrow);

            const config = {
              headers: {
                "content-type": "application/json-data",
                Authorization: "Bearer " + localStorage.getItem("rest-token"),
              },
            };

            axios
              .post(
                "/api/restaurantAddress/",
                formData,
                config
              )
              .then((res) => {
                if (!res.data.success) {
                  setDataSuccess("");
                  setSuccessDisp("none");
                  setErrorDisp("");
                  setDataError(res.data.message);
                  setTimeout(() => {
                    setErrorDisp("none");
                  }, 10000);
                }
                if (res.data.success) {
                  setDataError("");
                  setErrorDisp("none");
                  setSuccessDisp("");
                  setDataSuccess(res.data.message);
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
                  Restaurant Address
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
                    <label htmlFor="profileImage">
                      <input
                        style={{ display: "none" }}
                        accept="image/x-png,image/jpeg"
                        id="profileImage"
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
                        Restaurant Image
                      <AddCircle />
                      </Fab>
                    </label>
                    <br />
                    <br />

                    <Avatar src={image ? image : getDetails.profileImage ? `/uploads/${getDetails.profileImage}` : ""} />
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
                        id="restaurantName"
                        label="Restaurant Name"
                        name="restaurantName"
                        type="text"
                        value={values.restaurantName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="restaurantName"
                        autoFocus
                      />
                      <div>
                        <Error
                          touched={touched.restaurantName}
                          message={errors.restaurantName}
                        />
                      </div>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="restaurantDescription"
                        label="Restaurant Description"
                        type="text"
                        id="restaurantDescription"
                        autoComplete="restaurantDescription"
                        value={values.restaurantDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error
                          touched={touched.restaurantDescription}
                          message={errors.restaurantDescription}
                        />
                      </div>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="phone"
                        label="Phone"
                        type="number"
                        id="phone"
                        autoComplete="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error touched={touched.phone} message={errors.phone} />
                      </div>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="address"
                        label="Address"
                        type="text"
                        id="address"
                        autoComplete="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error
                          touched={touched.address}
                          message={errors.address}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="landmark"
                        label="landmark"
                        type="type"
                        id="landmark"
                        autoComplete="landmark"
                        value={values.landmark}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error
                          touched={touched.landmark}
                          message={errors.landmark}
                        />
                      </div>
                      <label style={{ color: "#808080" }}>Open From ?</label>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="openFrom"
                        label=""
                        type="time"
                        id="openFrom"
                        autoComplete="openFrom"
                        value={values.openFrom}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error
                          touched={touched.openFrom}
                          message={errors.openFrom}
                        />
                      </div>
                      <label style={{ color: "#808080" }}>Open Till ?</label>
                      <TextField
                        // variant="outlined"
                        margin="normal"
                        // required
                        fullWidth
                        name="openTill"
                        label=""
                        type="time"
                        id="openTill"
                        autoComplete="openTill"
                        value={values.openTill}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div>
                        <Error
                          touched={touched.openTill}
                          message={errors.openTill}
                        />
                      </div>
                      <FormControl
                        className={classes.formControl}
                        xs={6}
                        fullWidth
                      >
                        <InputLabel id="openTomorrow">Open Tomorrow ?</InputLabel>
                        <Select
                          labelId="openTomorrow"
                          id="openTomorrow"
                          name="openTomorrow"
                          autoComplete="openTomorrow"
                          value={values.openTomorrow}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ width: 100 }}
                        >

                          <MenuItem value={false}>Yes</MenuItem>
                          <MenuItem value={true}>
                            No
                        </MenuItem>
                        </Select>
                      </FormControl>
                      <div>
                        <Error
                          touched={touched.openTomorrow}
                          message={errors.openTomorrow}
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
                  //   disabled={isSubmitting}
                  >
                    Save Address
                </Button>
                </form>
              </div>
            </ThemeProvider>
          )}
      </Formik>
    </div>
  );
}
