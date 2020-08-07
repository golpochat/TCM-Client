import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'

import Layout from "../../layout/common/Layout";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Registration.css'

const Profile = ({ history, match }) => {
    const [values, setValues] = useState([]);
    const token = getCookie("token");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/registration/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((registration) => {
                // console.log(registration)
                const {
                    note,
                    fee,
                    status,
                    year_of_registration,
                    createdAt,
                    updatedAt
                } = registration.data;
                setValues({
                    note,
                    fee,
                    status,
                    year_of_registration,
                    createdAt,
                    updatedAt
                });
            })
            .catch(() => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error);
                history.push(`/${isAuth().role}/registration/list`);
            });
    };
    const profileInfo = () => (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 m-auto">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Year of registration</td>
                            <td>{moment(values.year_of_registration).format('YYYY')}</td>
                        </tr>
                        <tr>
                            <td>Fee</td>
                            <td>{`€${values.fee}`}</td>
                        </tr>
                        <tr>
                            <td>Note</td>
                            <td>{values.note}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td style={{ textTransform: "capitalize" }}>{values.status}</td>
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
                    <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/registration/list`}>Back to list</Link>
                    <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/registration/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );

    return (
        <Layout>
            <div className="container-expense-profile">
                <h1 className="text-center">Registration detail view</h1>
                {profileInfo()}
            </div>
        </Layout>
    );
};

export default Profile;
