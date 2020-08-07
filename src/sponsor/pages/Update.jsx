import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";
import './Sponsor.css'
const UpdateSponsor = ({ match, history }) => {
    const [values, setValues] = useState({
        name: "",
        address: '',
        email: "",
        contact_number: '',
        btnLabel: "Update",
    });
    const [year, setYear] = useState(new Date());
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
            .then((response) => {
                console.log("PLAYER PROFILE LOADED", response);
                const {
                    name,
                    address,
                    email,
                    contact_number,
                    year,
                } = response.data;
                setYear(year)
                setValues({
                    ...values,
                    name,
                    address,
                    email,
                    contact_number,
                    btnLabel: "Update",
                });

                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const {
        name,
        address,
        email,
        contact_number,
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
            url: `${process.env.REACT_APP_API}/sponsor/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                name,
                address,
                email,
                contact_number,
                year,
            },
        })
            .then((response) => {
                // console.log("PLAYER PROFILE UPDATE", response);
                toast.error(response.data.message);
                history.push(`/${isAuth().role}/sponsor/profile/${match.params.id}`);
            })
            .catch((error) => {
                console.log("SPONSOR PROFILE UPDATE ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Address</label>
                <input
                    onChange={handleChange("address")}
                    type="address"
                    className="form-control"
                    placeholder="Address"
                    value={address}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="address"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Contact number</label>
                <input
                    onChange={handleChange("contact_number")}
                    type="text"
                    className="form-control"
                    placeholder="Contact number"
                    value={contact_number}
                />
            </div>
            <div className="form-group">
                <div className="text-muted">Joining year</div>
                <DatePicker
                    className="form-control"
                    placeholderText="Click to select a year"
                    selected={new Date(year)}
                    onChange={year => setYear(year)}
                    maxDate={new Date()}
                    showYearPicker
                    dateFormat="yyyy"
                // isClearable={true}
                />
            </div>
            <Link to={`/admin/sponsor/profile/${match.params.id}`} className="btn btn-success btn-md mr-3">Back</Link>
            <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                {btnLabel}
            </Link>
        </form>
    );
    return (
        <Layout>
            <div className="container-update-sponsor">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mt-5 text-center">Sponsor Update</h1>
                    {updateFrom()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateSponsor;
