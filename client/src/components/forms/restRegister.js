import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "./loginErrors";

const validationSchema = Yup.object({
  name: Yup.string().min(4).required(),
  email: Yup.string().email().min(10).required(),
  password: Yup.string().min(6).required(),
  confirm_password: Yup.string().min(6).required(),
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#36454f" },
    secondary: {
      main: "#002984",
    },
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {"SWIGGY - Food Delivery App "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(9),
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
    width: "100%", // Fix IE 11 issue.
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

export default function RestRegister() {
  document.title = "Sign Up page";
  const classes = useStyles();
  const [loginError, setLoginError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const Details = {
          name: values.name,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
          type: "restaurant",
        };

        axios
          .post("api/register/", Details)
          .then((res) => {
            if (!res.data.success) {
              setRegisterSuccess("");
              setLoginError(res.data.message);
              setSubmitting(false);
            }
            if (res.data.success) {
              setSubmitting(true);
              setLoginError("");
              setRegisterSuccess(res.data.message);
              values.name = "";
              values.email = "";
              values.password = "";
              values.confirm_password = "";
            }
          })
          .catch((err) => console.log(err));
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
            <AppBar
              position="static"
              style={{ backgroundColor: "#36454f", height: 55 }}
            >
              <Typography
                component="h1"
                variant="h5"
                style={{
                  color: "#fdfbfb",
                  fontSize: 30,
                  textAlign: "center",
                  fontFamily: "georgia",
                  paddingTop: 5,
                }}
              >
                Swiggy - Food Delivery App
            </Typography>
            </AppBar>

            <Container component="main" maxWidth="xs">
              <CssBaseline />

              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign Up - Restaurant
              </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <div
                    className={classes.loginError}
                    style={{ alignText: "center" }}
                  >
                    {loginError}
                  </div>
                  <div style={{ paddingLeft: "17%" }}>
                    <span
                      style={{
                        color: "#36454f",
                        fontSize: 20,
                      }}
                    >
                      {registerSuccess}
                    </span>
                  </div>
                  <TextField
                    // variant="outlined"
                    margin="normal"
                    // required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    type="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    autoFocus
                  />
                  <div>
                    <Error touched={touched.name} message={errors.name} />
                  </div>
                  <TextField
                    // variant="outlined"
                    margin="normal"
                    // required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                  />
                  <div>
                    <Error touched={touched.email} message={errors.email} />
                  </div>
                  <TextField
                    // variant="outlined"
                    margin="normal"
                    // required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div>
                    <Error touched={touched.password} message={errors.password} />
                  </div>
                  <TextField
                    // variant="outlined"
                    margin="normal"
                    // required
                    fullWidth
                    name="confirm_password"
                    label="confirm_password"
                    type="password"
                    id="confirm_password"
                    autoComplete="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div>
                    <Error
                      touched={touched.confirm_password}
                      message={errors.confirm_password}
                    />
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    Sign Up
                </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/restaurantLogin" variant="body2">
                        {"Already a user? Sign In"}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
              <Box mt={8}>
                <Copyright />
              </Box>
            </Container>
          </ThemeProvider>
        )}
    </Formik>
  );
}
