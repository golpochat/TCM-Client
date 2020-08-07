import React from "react";
import axios from "axios";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = (response) => {
    // console.log(response);
    const { userID, email, accessToken } = response
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/facebook-login`,
      data: { userID, email, accessToken },
    })
      .then((response) => {
        // console.log("FACEBOOK LOGIN SUCCESS", response);
        toast.success(response.data.message);
        informParent(response);
      })
      .catch((error) => {
        // console.log("FACEBOOK LOGIN ERROR", error);
        toast.error(error.response.data.error);
      });
  };
  return (
    <div className="row mt-2">
      <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
        <FacebookLogin
          appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
          autoLoad={false}
          fields="email,name,picture"
          callback={responseFacebook}
          render={(renderProps) => (
            <Link
              to='#'
              onClick={renderProps.onClick}
              className="btn btn-primary btn-lg btn-block"
            >
              <i className="fab fa-facebook fa-lg pr-3"></i>
            Login with Facebook
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default Facebook;
