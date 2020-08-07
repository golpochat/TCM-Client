import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { getCookie } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";
import './Registration.css'
const UpdateRegistration = ({ match, history }) => {
    const [values, setValues] = useState({
        note: '',
        fee: '',
        status: '',
        btnLabel: "Update",
    });
    const [year_of_registration, setYearOfRegistration] = useState(new Date());
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
            .then((response) => {
                console.log("REGISTRATION DETAILS LOADED", response);
                const {
                    note,
                    fee,
                    status,
                } = response.data;
                setYearOfRegistration(year_of_registration)
                setValues({
                    ...values,
                    note,
                    fee,
                    status,
                    btnLabel: "Update",
                });
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("REGISTRATION UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const {
        note,
        fee,
        status,
        btnLabel,
    } = values;
    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Updating" });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/registration/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                note,
                year_of_registration,
                fee,
                status,
            },
        })
            .then((response) => {
                // console.log("PLAYER PROFILE UPDATE", response);
                toast.error(response.data.message);
                history.push(`/dashboard`);
            })
            .catch((error) => {
                console.log("REGISTRATION DETAILS UPDATE ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Note</label>
                <input
                    onChange={handleChange("note")}
                    type="text"
                    className="form-control"
                    placeholder="Keep a note"
                    value={note}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Registration fee</label>
                <input
                    onChange={handleChange("fee")}
                    type="number"
                    className="form-control"
                    placeholder="Registration fee"
                    value={fee}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Availability for the match</label>
                <select className="form-control" name="type" value={status} onChange={handleChange("status")}>
                    <option key="select" value="">Select one</option>
                    <option key="1" value="registered">Registered</option>
                    <option key="2" value="unregistered">Unregistered</option>
                    <option key="3" value="pending">Pending</option>
                </select>
            </div>
            <div className="form-group">
                <div className="text-muted">Year of registration</div>
                <DatePicker
                    className="form-control"
                    placeholderText="Click to select a year"
                    selected={new Date(year_of_registration)}
                    onChange={year => setYearOfRegistration(year)}
                    maxDate={new Date()}
                    showYearPicker
                    dateFormat="yyyy"
                // isClearable={true}
                />
            </div>
            <Link to={`/admin/registration/list`} className="btn btn-success btn-md mr-3">Back</Link>
            <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                {btnLabel}
            </Link>
        </form>
    );
    return (
        <Layout>
            <div className="container-update-registration">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mt-5 text-center">Registration update</h1>
                    {updateFrom()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateRegistration;
