import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'
import { toast } from "react-toastify";

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";

const View = ({ match, history }) => {
    const [payment, setPayment] = useState([]);
    const token = getCookie("token");
    const [profileID, setProfileID] = useState([])
    useEffect(() => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/player-payment/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND PLAYER PAYMENT", response.data);
                setPayment(response.data)
                setProfileID(response.data.profile)
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("PAYMENT LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }, [token, match.params.id]);

    const displayPaymentDetails = () => (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Date</td>
                            <td>{moment(payment.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                        <tr>
                            <td>Amount</td>
                            <td>{`€${payment.amount}`}</td>
                        </tr>
                        <tr>
                            <td>Reference</td>
                            <td>{payment.reference}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{payment.type}</td>
                        </tr>
                        <tr>
                            <td>Updated</td>
                            <td>{moment(payment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                        <tr>
                            <td>Created</td>
                            <td>{moment(payment.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center">
                    {isAuth().role === 'admin' ?
                        <Link className="btn btn-success btn-md mr-2" to={`/admin/player/profile-admin-view/${profileID}`}>Back to profile</Link> :
                        <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/profile`}>Back to profile</Link>
                    }
                    <Link className="btn btn-warning btn-md" to={`/admin/player-payment/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );
    return (
        <Layout>
            <div className="container-view-player-payment">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 responsive">
                        <h1 className="m-5 text-center">Payment details</h1>
                        {displayPaymentDetails()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default View;
