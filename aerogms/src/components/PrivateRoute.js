import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, userDetails, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      userDetails.isLoggedIn ? (
        <Component userDetails={userDetails} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login"
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
