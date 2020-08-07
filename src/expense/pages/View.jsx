import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'

import Layout from "../../layout/common/Layout";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Expense.css'

const Profile = ({ history, match }) => {
    const [values, setValues] = useState([]);
    const token = getCookie("token");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/expense/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((profile) => {
                // console.log(profile)
                const {
                    amount,
                    reference,
                    type,
                    date,
                    createdAt,
                    updatedAt
                } = profile.data;

                setValues({
                    amount,
                    reference,
                    type,
                    date,
                    createdAt,
                    updatedAt
                });
            })
            .catch(() => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error);
                history.push(`/${isAuth().role}/expense/list`);
            });
    };
    const profileInfo = () => (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 m-auto">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Date of expense</td>
                            <td>{moment(values.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                        <tr>
                            <td>Amount</td>
                            <td>{`€${values.amount}`}</td>
                        </tr>
                        <tr>
                            <td>Reference</td>
                            <td>{values.reference}</td>
                        </tr>
                        <tr>
                            <td>Payment made by</td>
                            <td>{values.type}</td>
                        </tr>
                        <tr>
                            <td>Updated</td>
                            <td>{moment(values.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                        <tr>
                            <td>Created</td>
                            <td>{moment(values.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center">
                    <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/expense/list`}>Back to list</Link>
                    <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/expense/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );

    return (
        <Layout>
            <div className="container-expense-profile">
                <h1 className="text-center">Expense detail view</h1>
                {profileInfo()}
            </div>
        </Layout>
    );
};

export default Profile;
