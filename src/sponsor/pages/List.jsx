import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Sponsor.css'

const SponsorList = () => {
    const [sponsors, setSponsors] = useState([]);
    const token = getCookie("token");

    useEffect(() => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/sponsor/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND SPONSOR LIST", response.data);
                setSponsors(response.data)
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("SPONSOR LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }, [token]);
    const handleDelete = sponsor => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/sponsor/delete/${sponsor._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("SPONSOR HAS BEEN DELETED", response);
                toast.error(response.data.message);
                if (response.status === 200) {
                    const newList = sponsors.filter(s => s._id !== sponsor._id)
                    setSponsors(newList)
                }
            })
            .catch((error) => {
                console.log("SPONSOR DELETING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };
    const displaySponsorList = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sponsors.map(sponsor => (
                                <tr key={sponsor._id}>
                                    <td>{sponsor.name}</td>
                                    <td>{sponsor.address}</td>
                                    <td>{sponsor.contact_number}</td>
                                    <td>{sponsor.status === 1 ? "Active" : "Inactive"}</td>
                                    <td className="text-right">
                                        <Link to={`/${isAuth().role}/sponsor/profile/${sponsor._id}`} className="btn btn-success btn-sm mr-2">View profile</Link>
                                        <Link to={`/${isAuth().role}/sponsor/update/${sponsor._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                                        <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(sponsor) }; }} className="btn btn-danger btn-sm">Delete</Link>
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
            <div className="container-sponsor">
                <h1 className="text-center">List of Sponsors</h1>
                <hr />
                <div className="text-right">
                    <Link to={`/${isAuth().role}/sponsor/create`} className="btn btn-primary btn-md mb-3">Add new sponsor</Link>
                </div>
                {displaySponsorList()}
            </div>
        </Layout>
    );
};

export default SponsorList;
