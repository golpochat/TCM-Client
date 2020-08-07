import React, { useState, useEffect } from "react";
import axios from "axios";
// import { toast } from "react-toastify";

import Layout from "../../layout/common/Layout";
import Avatar from '../../shared/card/Avatar'
import image from '../profile_pictures/sujan.png'
import { isAuth, getCookie } from "../../auth/AuthHelper";

const AdminProfile = ({ history }) => {
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
        if (profile) {
          const { first_name,
            last_name,
            address,
            contact_number,
            joining_year,
            level } = profile.data;
          const { role, name, email } = profile.data.user;

          setValues({
            role,
            name,
            email,
            first_name,
            last_name,
            address,
            contact_number,
            joining_year,
            level
          });
        }
        else {
          // console.log(profile.response.status)

          history.push(`/${isAuth().role}/profile/create`);

        }
      })
      .catch((error) => {
        console.log("PLAYER PROFILE UPDATE ERROR", error);
      });
  };

  const profileInfo = () => (
    <div className="row">
      <div className="cpl-sm-12 col-md-6 col-lg-6">
        <Avatar
          img={image}
        />
        <div className="input-group mt-2">
          <div className="custom-file">
            <input type="file" className="custom-file-input" id="inputGroupFile04" />
            <label className="custom-file-label" htmlFor="inputGroupFile04">Choose your profile picture</label>
          </div>
          <div className="input-group-append">
            <button className="btn btn-success" type="button">Upload</button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <table className="table">
          <tbody>
            <tr>
              <td>Role</td>
              <td>{values.role}</td>
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
              <td>{new Date(values.joining_year).getFullYear()}</td>
            </tr>
            <tr>
              <td>Level of Professionalism</td>
              <td>{values.level}</td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-block btn-success btn-md">Edit profile</button>
      </div>
    </div >
  );
  const paymentInfo = () => (
    <div className="row">
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="card-title text-success">Total amount</h2>
            <hr />
            <h2>€{350}</h2>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="card-title text-success">Paid</h2>
            <hr />
            <h2>€{250}</h2>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="card-title text-success">Outstanding</h2>
            <hr />
            <h2>€{100}</h2>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Layout>
      <div className="container-admin">
        <h1 className="text-lead text-center mt-5">{`${values.first_name} ${values.last_name}`}</h1>
        <hr />
        {profileInfo()}
        <hr />
        {paymentInfo()}
        <hr />
      </div>
    </Layout>
  );
};

export default AdminProfile;
