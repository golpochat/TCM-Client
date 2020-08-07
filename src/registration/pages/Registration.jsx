import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'
import { toast } from "react-toastify";

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Registration.css'

const Registration = () => {
  const [registrations, setRegistrations] = useState([]);
  const token = getCookie("token");

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/registration/list`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        // console.log("FOUND REGISTRATION LIST", response.data);
        setRegistrations(response.data)
        toast.success(response.data.message);
      })
      .catch((error) => {
        // console.log("REGISTRATION LOADING ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  }, [token]);
  const handleDelete = registration => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API}/registration/delete/${registration._id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("REGISTRATION HAS BEEN DELETED", response);
        toast.error(response.data.message);
        if (response.status === 200) {
          const newList = registrations.filter(s => s._id !== registration._id)
          setRegistrations(newList)
        }
      })
      .catch((error) => {
        console.log("REGISTRATION DELETING ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };
  const displayRegistraionList = () => (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Year</th>
              <th>Fee</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              registrations.map(registration => (
                <tr key={registration._id}>
                  <td>{registration.profile.first_name + ' ' + registration.profile.last_name}</td>
                  <td>{moment(registration.year_of_registration).format('YYYY')}</td>
                  <td>{`€${registration.fee}`}</td>
                  <td style={{ textTransform: "capitalize" }}>{registration.status}</td>
                  <td className="text-right">
                    <Link to={`/${isAuth().role}/registration/read/${registration._id}`} className="btn btn-success btn-sm mr-2">View</Link>
                    <Link to={`/${isAuth().role}/registration/update/${registration._id}`} className="btn btn-warning btn-sm mr-2">Edit & accept</Link>
                    <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to cancel this registration?')) { handleDelete(registration) }; }} className="btn btn-danger btn-sm">Cancel registration</Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  return (
    <Layout>
      <div className="container-registration-list">
        <h1 className="text-center">Registration # {moment(new Date()).format('YYYY')}</h1>
        <hr />
        {displayRegistraionList()}
      </div>
    </Layout>
  );
};

export default Registration;

