import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie, isAuth } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";

const View = ({ match, history }) => {
    const [payment, setPayment] = useState([]);
    const token = getCookie("token");
    const [sponsorID, setSponsorID] = useState([])
    useEffect(() => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/sponsor-payment/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("FOUND SPONSOR PAYMENT", response.data);
                setPayment(response.data)
                setSponsorID(response.data.sponsor)
                toast.success(response.data.message);
            })
            .catch((error) => {
                console.log("PAYMENR LOADING ERROR", error.response.data.error);
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
                            <td>{payment.date}</td>
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
                    </tbody>
                </table>
                <div className="text-center">
                    <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/sponsor/profile/${sponsorID}`}>Back to profile</Link>
                    <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/sponsor-payment/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );
    return (
        <Layout>
            <div className="container-view-sponsor-payment">
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
