import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";
import './Tournament.css'

const UpdateTournament = ({ match, history }) => {
    const [values, setValues] = useState({
        name: "",
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
            url: `${process.env.REACT_APP_API}/tournament/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("TEAM DETAILS LOADED", response);
                const {
                    name,
                    year,
                } = response.data;
                setYear(year)
                setValues({
                    ...values,
                    name,
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
            url: `${process.env.REACT_APP_API}/tournament/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                name,
                year,
            },
        })
            .then((response) => {
                // console.log("TEAM DETAILS UPDATED", response);
                toast.error(response.data.message);
                history.push(`/${isAuth().role}/tournament/profile/${match.params.id}`);
            })
            .catch((error) => {
                // console.log("TEAM DETAILS UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                        <input
                            onChange={handleChange("name")}
                            type="text"
                            className="form-control"
                            placeholder="Name of the tournament"
                            value={name}
                        />
                    </div>
                    <div className="form-group">
                        <div className="text-muted">The year of the tournament</div>
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
                    <Link to={`/admin/tournament/profile/${match.params.id}`} className="btn btn-success btn-md mr-3">Back</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-tournament-update">
                <h1 className="text-center">Tournament Update</h1>
                <hr />
                {updateFrom()}
            </div>
        </Layout>
    );
};

export default UpdateTournament;
