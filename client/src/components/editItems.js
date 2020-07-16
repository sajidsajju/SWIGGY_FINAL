import React, { useState, useEffect } from "react";
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
import Image from "material-ui-image";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { restLogged } from "../components/actions";
import Alert from "@material-ui/lab/Alert";
import jwtDecode from "jwt-decode";

const validationSchema = Yup.object({
  itemName: Yup.string().min(6).max(30).required(),
  itemDescription: Yup.string().min(6).max(50).required(),
  itemPrice: Yup.string().required(),

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
}));

export default function EditRestDetails({ match }) {
  document.title = "Restaurant Address";
  // const history = useHistory();
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
        .get("/api/items/" + match.params.uid + "/" + match.params.id, config)
        .then((res) => {
          if (res.data.success) {
            setGetDetails(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();

  }, [dispatch, match.params]);

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
        disabling=""
      />


      <Formik
        initialValues={{
          itemName: getDetails.itemName ? getDetails.itemName : "",
          itemDescription: getDetails.itemDescription ? getDetails.itemDescription : "",
          itemPrice: getDetails.itemPrice ? getDetails.itemPrice : "",
          veg: getDetails.veg ? getDetails.veg : false,
        }}
        enableReinitialize="true"
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (image === "" && !getDetails.itemImage) {
            setImageError(true);
          } else {
            setImageError(false);


            const formData = new FormData();

            if (image !== "") {
              formData.append("itemImage", selectedFile);
            }

            formData.append("itemName", values.itemName);
            formData.append("itemDescription", values.itemDescription);
            formData.append("itemPrice", values.itemPrice);
            formData.append("Veg", values.veg);

            const config = {
              headers: {
                "content-type": "application/json-data",
                Authorization: "Bearer " + localStorage.getItem("rest-token"),
              },
            };

            axios
              .post(
                "/api/items/" + match.params.id,
                formData,
                config
              )
              .then((res) => {
                if (!res.data.success) {
                  console.log(res.data)
                  setSubmitting(false);
                  setDataSuccess("");
                  setSuccessDisp("none");
                  setErrorDisp("");
                  setDataError(res.data.message);
                  setTimeout(() => {
                    setErrorDisp("none");
                  }, 10000);
                  // console.log(res.data)
                }
                if (res.data.success) {
                  setSubmitting(true);
                  setDataError("");
                  setErrorDisp("none");
                  setSuccessDisp("");
                  setDataSuccess(res.data.message);
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
                  Update Item
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
                      style={{ width: 150, height: 150 }}
                    >
                      <Image disableSpinner={true} src={image ? image : getDetails.itemImage ? `/uploads/${getDetails.itemImage}` : ""} />
                    </div>

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
                        <InputLabel id="veg">Veg ?</InputLabel>
                        <Select
                          labelId="veg"
                          id="veg"
                          name="veg"
                          autoComplete="veg"
                          value={values.veg}
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
                          touched={touched.veg}
                          message={errors.veg}
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
                    Update Item
                        </Button>
                </form>
              </div>
            </ThemeProvider>
          )}
      </Formik>
    </div>
  )
};
