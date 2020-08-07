import React from "react";
import axios from "axios";
import GoogleLogin from "react-google-login";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Google = ({ informParent = (g) => g }) => {
  const responseGoogle = (response) => {
    // console.log(response.tokenId);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        console.log("GOOGLE LOGIN SUCCESS", response);
        toast.success(response.data.message);
        informParent(response);
      })
      .catch((error) => {
        console.log("GOOGLE LOGIN ERROR", error);
        toast.error(error.response.data.error);
      });
  };
  return (
    <div className="row mt-2">
      <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          render={(renderProps) => (
            <Link
              to='#'
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="btn btn-danger btn-lg btn-block"
            >
              <i className="fab fa-google fa-lg pr-3"></i>
            Login with Google
            </Link>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};

export default Google;
