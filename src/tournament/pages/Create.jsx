import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Tournament.css'

const CreateTournament = ({ history }) => {
    const [values, setValues] = useState({
        name: "",
        btnLabel: "Create",
    });
    const [year, setYear] = useState(new Date());
    const token = getCookie("token");

    const {
        name,
        btnLabel
    } = values;
    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/tournament/create`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                name,
                year,
            },
        })
            .then((response) => {
                // console.log("PLAYER PROFILE UPDATE", response);
                toast.error(response.data.message);
                history.push(`/${isAuth().role}/tournament/list`);
            })
            .catch((error) => {
                // console.log("TOURNAMENT CREATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const createTournamentForm = () => (
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
                            selected={year}
                            onChange={year => setYear(year)}
                            maxDate={new Date()}
                            showYearPicker
                            dateFormat="yyyy"
                            isClearable={true}
                        />
                    </div>
                    <Link to={`/admin/tournament/list`} className="btn btn-success btn-md mr-3">Back to team list</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-tournament-create">
                <h1 className="text-center">Create Tournament</h1>
                <hr />
                {createTournamentForm()}
            </div>
        </Layout>
    );
};

export default CreateTournament;
