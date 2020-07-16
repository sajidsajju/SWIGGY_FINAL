import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { AppBar } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { orange } from "@material-ui/core/colors";
import { useSelector, useDispatch } from "react-redux";
import { userLogged } from "../actions";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "./loginErrors";

const validationSchema = Yup.object({
  email: Yup.string().email().min(10).required(),
  password: Yup.string().min(6).required(),
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

export default function SignIn() {
  document.title = "Login";
  const classes = useStyles();
  const [loginError, setLoginError] = useState("");

  let isLoggedState = useSelector((state) => state.userLogged);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) dispatch(userLogged(true))
    else dispatch(userLogged(false))
  });
  if (isLoggedState) {
    return <Redirect to="/home" />;
  }
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const loginDetails = {
          email: values.email,
          password: values.password,
          type: "user",
        };

        axios
          .post("/api/login/", loginDetails)
          .then((res) => {
            if (!res.data.success) {
              setLoginError(res.data.message);
              setSubmitting(false);
            }
            if (res.data.success) {
              localStorage.setItem("user-token", res.data.token);
              setLoginError("");
              setSubmitting(true);
              dispatch(userLogged(true));
              values.email = "";
              values.password = "";
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
            <AppBar style={{ backgroundColor: "#36454f", height: 55 }}>
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
              {/* <div > */}

              {/* </div> */}
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
              </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <div className={classes.loginError}>{loginError}</div>
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
                    autoFocus
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    Sign In
                </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="/recover" variant="body2">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
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
