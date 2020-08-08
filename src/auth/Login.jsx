import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Google from "./Google";
import Facebook from "./Facebook";

import Layout from "../layout/common/Layout";
import { authenticate, isAuth, isAdmin, isPlayer, getCookie } from "./AuthHelper";
import './Auth.css'

const Login = ({ history }) => {
  const [values, setValues] = useState({
    // email: "sujanhossain313@gmail.com",
    // password: "abc123",
    email: "",
    password: "",
    btnLabel: "Login",
  }, []);

  const { email, password, btnLabel } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  // received info from google/facebook account
  const informParent = (response) => {
    // save the response (user, token) to local storate/cookie
    authenticate(response, () => {
      // checking if the profile is exist
      const token = getCookie("token");
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API}/${isAuth().role}/profile`,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((profile) => {
          if (profile) {
            if (isAdmin())
              history.push('/')
            else if (isPlayer)
              history.push('player/profile')
          }
          else {
            history.push(`/${isAuth().role}/profile/create`);
          }
        })
        .catch((error) => {
          // console.log("LOGIN ERROR", error);
          toast.error(error.response.data.error);
          history.push(`/${isAuth().role}/profile/create`);
        });
    });
  };

  const clickedLoginButton = (event) => {
    event.preventDefault();
    setValues({ ...values, btnLabel: "Logging" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/login`,
      data: { email, password },
    })
      .then((response) => {
        // console.log("LOGIN SUCCESSFULL", response);

        // save the response (user, token) to local storate/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            btnLabel: "Loggedin",
          });
          // checking if the profile is exist
          const token = getCookie("token");
          axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/${isAuth().role}/profile`,
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(() => {
              if (isAdmin())
                history.push('/')
              else if (isPlayer)
                history.push('player/profile')
            })
            .catch(() => {
              // alert('Now it\'s time to create your profile.')
              toast.success('Now it\'s time to create your profile.');
              history.push(`/${isAuth().role}/profile/create`);
            });

        });
      })
      .catch((error) => {
        // console.log("LOGIN ERROR", error.response.data);
        setValues({ ...values, btnLabel: "Login" });
        toast.error(error.response.data.error);
      });
  };

  const loginFrom = () => (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
        <form>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              onChange={handleChange("email")}
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={handleChange("password")}
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
            />
          </div>
          <div className="form-group">
            <small>
              Can't remember your password?
          <Link to="/auth/password/forgot"> Click here </Link>
          to reset.
        </small>
          </div>
          <Link className="btn btn-success btn-lg btn-block" to="#" onClick={clickedLoginButton}>
            <i className="fa fa-user-lock fa-lg pr-3" />
            {btnLabel}
          </Link>
        </form>
      </div>
    </div>
  );
  return (
    <Layout>
      <div className="container-login">
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="text-center">Login</h1>
        <hr />
        {loginFrom()}
        <Google informParent={informParent} />
        <Facebook informParent={informParent} />
      </div>
    </Layout>
  );
};

export default Login;
