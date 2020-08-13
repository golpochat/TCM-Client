import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

import { getCookie } from "../../auth/AuthHelper";
import Layout from '../../layout/common/Layout';

const UpdateDetails = ({ history, match }) => {
    const [values, setValues] = useState({
        run: 0,
        wicket: 0,
        match_fee: 5,
        btnLabel: "Create",
    });

    const token = getCookie("token");
    const {
        run,
        wicket,
        match_fee,
    } = values;



    useEffect(() => {
        loadProfile();
    }, []);
    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match-detail/read/${match.params.p_id}`,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                // console.log("ADMIN PROFILE LOADED", response);
                const {
                    run,
                    wicket,
                    match_fee,

                } = response.data;
                setValues({
                    ...values,
                    run,
                    wicket,
                    match_fee,

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

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/match-detail/update/${match.params.p_id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: { run, wicket, match_fee }
        })
            .then((response) => {
                // console.log("CREATE MATCH", response);
                toast.success(response.data.message);
                history.push(`/admin/match-detail/create/${match.params.m_id}`);
            })
            .catch((error) => {
                console.log("CREATE MATCH ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const UpdateForm = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">Run</label>
                        <input
                            onChange={handleChange("run")}
                            type="number"
                            className="form-control"
                            placeholder="Total run of the match"
                            min={0}
                            value={run}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Wicket</label>
                        <input
                            onChange={handleChange("wicket")}
                            type="number"
                            className="form-control"
                            placeholder="Total wicket of the match"
                            min={0}
                            max={10}
                            value={wicket}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Match fee</label>
                        <input
                            onChange={handleChange("match_fee")}
                            type="number"
                            className="form-control"
                            placeholder="Fee for the match"
                            min={0}
                            value={match_fee}
                        />
                    </div>
                    <div className="text-center">
                        <Link to='#' onClick={doSubmit} className='btn btn-outline-primary btn-md mr-2'>Update</Link>
                        <Link to={`/admin/match-detail/create/${match.params.m_id}`} className='btn btn-outline-success btn-md'>Back to match detail</Link>
                    </div>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-admin-profile-create">
                <h1 className="text-center">Update details</h1>
                <hr />
                {UpdateForm()}
            </div>
        </Layout>
    );
};
export default UpdateDetails  