import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";

import { isAuth, logout, isAdmin } from "../../auth/AuthHelper";
import AdminMenu from "../adminLayout/AdminMenu";
import './Navbar.css'

const NavBar = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <Link className="navbar-brand" to="/">
          TCM
        </Link>
        <Link
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          to="#"
        >
          <span className="navbar-toggler-icon" />
        </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {!isAuth() &&
              <li className="nav-item">
                <NavLink className="nav-link" to="/ranking">
                  Ranking
              </NavLink>
              </li>}

            {/* Admin section */}
            {isAuth() && isAdmin() && <AdminMenu />}

            {/* end of Admin section */}
          </ul>
          <ul className="nav navbar-nav ml-auto">
            {
              /* if the user is logged in user then show the profile else show sign-in and sign-up links */
              isAuth() ? (
                <Fragment>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {isAdmin() ? "Admin" : "My profile"}
                    </NavLink>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link className="dropdown-item" to={`/${isAuth().role}/profile`}>
                        View
                      </Link>
                      <Link className="dropdown-item" to={`/${isAuth().role}/user/update`}>
                        Setting
                      </Link>
                      <Link className="dropdown-item" to="/login" onClick={() => logout()} >
                        Logout
                      </Link>
                    </div>
                  </li>
                </Fragment>
              ) : (
                  <Fragment>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/signup">
                        Signup
                  </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/login">
                        Login
                  </NavLink>
                    </li>
                  </Fragment>
                )
            }
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
