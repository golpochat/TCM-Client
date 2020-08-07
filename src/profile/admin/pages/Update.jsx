import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../../auth/AuthHelper";
import Layout from "../../../layout/common/Layout";
import './Profile.css';

const UpdateProfile = ({ history }) => {
    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        address: '',
        contact_number: '',
        level: 'n/a',
        image: '',
        btnLabel: "Update",
    });
    const [joining_year, setJoiningYear] = useState(new Date());
    const [file, setFile] = useState('');
    const token = getCookie("token");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/${isAuth().role}/profile`,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                // console.log("ADMIN PROFILE LOADED", response);
                const {
                    first_name,
                    last_name,
                    address,
                    contact_number,
                    image,
                } = response.data;
                setJoiningYear(response.data.joining_year)
                setValues({
                    ...values,
                    first_name,
                    last_name,
                    address,
                    contact_number,
                    image,
                    btnLabel: "Update",
                });
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("ADMIN PROFILE UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const {
        first_name,
        last_name,
        address,
        contact_number,
        level,
        image,
        btnLabel
    } = values;

    const handleChange = (name) => (event) => {
        if (name === 'image') {
            setFile(event.target.files[0])
        }
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData()
        formData.append('first_name', first_name)
        formData.append('last_name', last_name)
        formData.append('address', address)
        formData.append('contact_number', contact_number)
        formData.append('level', level)
        formData.append('joining_year', joining_year)
        formData.append('image', image)
        formData.append('image', file)

        // console.log(formData)

        setValues({ ...values, btnLabel: "Updating" });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/${isAuth().role}/profile/update`,
            headers: { Authorization: `Bearer ${token}` },
            data: formData
        })
            .then((response) => {
                // console.log("ADMIN PROFILE UPDATE", response);
                toast.success(response.data.message);
                history.push(`/${isAuth().role}/profile`);
            })
            .catch((error) => {
                // console.log("ADMIN PROFILE UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                // toast.error('Error in updating profile, try again later.');
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">First name</label>
                        <input
                            onChange={handleChange("first_name")}
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            value={first_name}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Last name</label>
                        <input
                            onChange={handleChange("last_name")}
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            value={last_name}
                        />
                    </div>
                    <div className="form-group">
                        <p className="text-muted">Profile Picture</p>
                        <input
                            onChange={handleChange("image")}
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            id="profile_picture"
                        // value={image}
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
                            selected={new Date(joining_year)}
                            onChange={year => setJoiningYear(year)}
                            maxDate={new Date()}
                            showYearPicker
                            dateFormat="yyyy"
                        />
                    </div>
                    <Link to={`/${isAuth().role}/profile`} className="btn btn-success btn-md mr-3">Back to profile</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-admin-profile-update">
                <h1 className="text-center">Admin profile update</h1>
                <hr />
                {updateFrom()}
            </div>
        </Layout>
    );
};

export default UpdateProfile;
