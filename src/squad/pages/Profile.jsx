import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import Layout from "../../layout/common/Layout";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Squad.css'

const Profile = ({ history, match }) => {
    const [values, setValues] = useState([]);
    const [payments, setPayments] = useState([])
    const token = getCookie("token");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/sponsor/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((profile) => {
                // console.log(profile)
                axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API}/sponsor-payment/all/${match.params.id}`,
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((payments) => {
                        setPayments(payments.data)
                    })
                    .catch((error) => {
                        console.log('NO PAYMENT LOGS FOUND')
                        // toast.error(error.data.error)
                    })

                const {
                    name,
                    address,
                    email,
                    contact_number,
                    year,
                } = profile.data;

                setValues({
                    name,
                    address,
                    email,
                    contact_number,
                    year,
                });
            })
            .catch(() => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error);
                history.push(`/${isAuth().role}/profile/list`);
            });
    };

    const handleDelete = payment => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/sponsor-payment/delete/${payment._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("SPONSOR PAYMENT HAS BEEN DELETED", response);
                toast.error(response.data.message);
                const newList = payments.filter(s => s._id !== payment._id)
                setPayments(newList)
            })
            .catch((error) => {
                console.log(" DELETING PAYMENT ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };

    const profileInfo = () => (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 m-auto">
                <table className="table">
                    <tbody>
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
                            <td>{moment(values.year).format('YYYY')}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>{values.status === 1 ? "Active" : "Inactive"}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center">
                    <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/sponsor/list`}>Back to sponsor list</Link>
                    <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/sponsor/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );

    const paymentInfo = () => (
        <Fragment>
            <div className="row mt-5">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="card-title text-success">Total Paid</h2>
                            <hr />
                            <h2>{`€${payments.reduce((result, payment) => result + payment.amount, 0)}`}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="card-title text-success">Add Payment</h2>
                            <hr />
                            <Link to={`/${isAuth().role}/sponsor-payment/create/${match.params.id}`} className="btn btn-primary btn-block btn-lg"><i className="fa fa-plus-circle fa-lg" aria-hidden="true"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-sm-12 col-md-12 col-lg-12 responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Reference</th>
                                <th>Type</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{moment(payment.year).format('DD-MM-YYYY')}</td>
                                    <td>{`€${payment.amount}`}</td>
                                    <td>{payment.reference}</td>
                                    <td>{payment.type}</td>
                                    <td className="text-center">
                                        <Link to={`/${isAuth().role}/sponsor-payment/read/${payment._id}`} className="btn btn-success btn-sm">View</Link>
                                        <Link to={`/${isAuth().role}/sponsor-payment/update/${payment._id}`} className="btn btn-warning btn-sm ml-2">Edit</Link>
                                        <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(payment) }; }} className="btn btn-danger btn-sm">Delete</Link>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    )

    return (
        <Layout>
            <div className="profile-container">
                <h1 className="text-lead text-center mt-5">{`${values.name}`}</h1>
                <hr />
                {profileInfo()}
                {paymentInfo()}
            </div>
        </Layout>
    );
};

export default Profile;
