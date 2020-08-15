import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'

import Layout from "../../../layout/common/Layout";
import Avatar from '../../../shared/avatar/Avatar'
import { isAuth, getCookie } from "../../../auth/AuthHelper";
import './Profile.css'

const Profile = ({ history }) => {
  const [values, setValues] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/${isAuth().role}/profile`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((profile) => {
        // console.log(profile)
        const {
          first_name,
          last_name,
          address,
          contact_number,
          joining_year,
          level,
          image
        } = profile.data;
        const { role, email } = profile.data.user;

        setValues({
          role,
          email,
          first_name,
          last_name,
          address,
          contact_number,
          joining_year,
          level,
          image
        });
      })
      .catch(() => {
        // console.log("PLAYER PROFILE UPDATE ERROR", error);
        history.push(`/${isAuth().role}/profile/create`);
      });
  };

  const profileInfo = () => (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6 text-center">
        <Avatar
          img={values.image}
        />
      </div>
      <div className="col-sm-12 col-md-12 col-lg-6 m-auto table-responsive">
        <table className="table mt-3">
          <tbody>
            <tr>
              <td>Role</td>
              <td style={{ textTransform: "capitalize" }}>{values.role}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{values.address}</td>
            </tr>
            <tr>
              <td>Contact number</td>
              <td>{values.contact_number}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{values.email}</td>
            </tr>
            <tr>
              <td>Joining year</td>
              <td>{moment(values.joining_year).format('YYYY')}</td>
            </tr>
          </tbody>
        </table>
        <Link to={`/${isAuth().role}/profile/update`} className="btn btn-block btn-warning btn-md mt-3">Update profile</Link>
      </div>
    </div >
  );

  return (
    <Layout>
      <div className="container-profile">
        <h1 className="text-lead text-center">{`${values.first_name} ${values.last_name}`}</h1>
        <hr />
        {profileInfo()}
      </div>
    </Layout>
  );
};

export default Profile;
