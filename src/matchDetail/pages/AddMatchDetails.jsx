import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

import { getCookie } from "../../auth/AuthHelper";
import Layout from '../../layout/common/Layout';

const AddDetails = ({ history, match }) => {
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
    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const doSubmit = (event) => {
        console.log(event)
        event.preventDefault();
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/match-detail/create/${match.params.p_id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: { run, wicket, match_fee, match: match.params.m_id, profile: match.params.p_id }
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

    const AddForm = () => (
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
                        <Link to='#' onClick={doSubmit} className='btn btn-outline-primary btn-md mr-2'>Save</Link>
                        <Link to={`/admin/match-detail/create/${match.params.m_id}`} className='btn btn-outline-success btn-md'>Back to match detail</Link>
                    </div>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-admin-profile-create">
                <h1 className="text-center">Add details</h1>
                <hr />
                {AddForm()}
            </div>
        </Layout>
    );
};
export default AddDetails  