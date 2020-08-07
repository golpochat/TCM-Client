import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Sponsor.css'

const CreateSponsor = ({ match, history }) => {
    const [values, setValues] = useState({
        name: "",
        address: '',
        email: "",
        contact_number: '',
        btnLabel: "Create",
    });
    const [year, setYear] = useState(new Date());
    const token = getCookie("token");

    const {
        name,
        address,
        email,
        contact_number,
        btnLabel
    } = values;
    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Updating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/sponsor/create`,
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
                history.push(`/${isAuth().role}/sponsor/list`);
            })
            .catch((error) => {
                console.log("SPONSOR PROFILE CREATE ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const createForm = () => (
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
                    defaultValue={address}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="address"
                    className="form-control"
                    placeholder="Email"
                    defaultValue={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Contact number</label>
                <input
                    onChange={handleChange("contact_number")}
                    type="text"
                    className="form-control"
                    placeholder="Contact number"
                    defaultValue={contact_number}
                />
            </div>
            <div className="form-group">
                <div className="text-muted">Joining year</div>
                <DatePicker
                    className="form-control"
                    placeholderText="Click to select a year"
                    selected={year}
                    onChange={year => setYear(year)}
                    maxDate={new Date()}
                    showYearPicker
                    dateFormat="yyyy"
                    isClearable={true}
                />
            </div>

            <Link to={`/admin/sponsor/list`} className="btn btn-success btn-md mr-3">Back to sponsor list</Link>
            <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                {btnLabel}
            </Link>
        </form>
    );
    return (
        <Layout>
            <div className="container-create-sponsor">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mt-5 text-center">Create Sponsor</h1>
                    {createForm()}
                </div>
            </div>
        </Layout>
    );
};

export default CreateSponsor;
