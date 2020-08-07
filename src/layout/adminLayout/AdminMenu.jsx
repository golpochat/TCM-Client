import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { isAuth } from "../../auth/AuthHelper";

const AdminMenu = () => {
  return (
    <Fragment>
      <li className="nav-item">
        <NavLink className="nav-link" to="/dashboard">
          Dashboard
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/team/list`}>
          Team
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/tournament/list`}>
          Tournament
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/squad/list`}>
          Squad
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/match/list`}>
          Match
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/sponsor/list`}>
          Sponsor
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/player/list`}>
          Player
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/expense/list`}>
          Expense
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/user/list`}>
          User
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to={`/admin/reporting/reporting`}>
          Reporting
        </NavLink>
      </li>
    </Fragment>
  );
};

export default AdminMenu;
