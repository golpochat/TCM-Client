import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth, isPlayer } from "../auth/AuthHelper";

const PlayerRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth() && isPlayer() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/unauthorised-access",
              state: { from: props.location },
            }}
          />
        )
    }
  />
);
export default PlayerRoute;
