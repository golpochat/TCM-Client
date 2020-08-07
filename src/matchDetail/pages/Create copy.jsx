import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './MatchDetail.css'
import { useEffect } from "react";

const CreateMatchDetail = ({ history, match }) => {
    const [values, setValues] = useState([{
        profile: [''],
        run: [0],
        wicket: [0],
        match_fee: [5],
        // btnLabel: "Create",
    }]);
    const [profiles, setProfiles] = useState([]);
    const [matchInfo, setMatchInfo] = useState();
    const [team, setTeam] = useState();

    const token = getCookie("token");
    useEffect(() => {
        loadSquad();
    }, []);


    const loadSquad = () => {
        // loading all the teams
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/squad/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("SQUAD DATA LOADED", response);

                setProfiles(response.data.profile);
                setTeam(response.data.team);
                setMatchInfo(response.data.match);
                toast.error(response.data.message);
            })
            .catch((error) => {
                // console.log("SQUAD LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }
    // console.log(values)

    const handleChange = (name, profileID) => (event) => {
        // let newArr = [...values];
        // if (values.findIndex((item) => item.profile === profileID) === 0) {
        if (values.findIndex((item) => item.profile === profileID) === 0) {
            setValues(values[profileID], { [name]: event.target.value });
        }
        else {
            values.profile = profileID
            setValues([{ ...values[profileID], [name]: event.target.value }]);
            // console.log(newArr)
        }

        console.log(values)
    };

    const {
        profile,
        run,
        wicket,
        match_fee,
        btnLabel
    } = values;
    // console.log(values)
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/match-detail/create/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data:
            {
                profile,
                run,
                wicket,
                match_fee
            }

        })
            .then((response) => {
                // console.log("CREATE MATCH", response);
                toast.success(response.data.message);
                // history.push(`/${isAuth().role}/match/list`);
            })
            .catch((error) => {
                console.log("CREATE MATCH ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const CreateMatchDetailForm = () => (
        <div className="row">
            <form>
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Player</th>
                                    <th>Run</th>
                                    <th>Wicket</th>
                                    <th>Match fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    profiles.map((player, count) => (
                                        <tr key={player._id}>
                                            <td>{`${count + 1}`}</td>
                                            <td>{`${player.first_name} ${player.last_name}`} </td>
                                            <td>
                                                <input type="number" name="run"
                                                    onChange={handleChange('run', player._id)}
                                                    min={0}
                                                    value={run}
                                                />
                                            </td>
                                            <td>
                                                <input type="number" name="wicket"
                                                    onChange={handleChange('wicket', player._id)}
                                                    min={0}
                                                    max={10}
                                                    value={wicket}
                                                />
                                            </td>
                                            <td>
                                                <input type="number" name="match_fee"
                                                    onChange={handleChange('match_fee', player._id)}
                                                    min={0}
                                                    value={match_fee}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center">
                    <Link to={`/admin/match/list`} className="btn btn-success btn-md mr-3">Back to match list</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        Create
                    </Link>
                </div>
            </form>
        </div>

    );
    return (
        <Layout>
            <div className="container-match-detail-create">
                <h1 className="text-center">Match details entry</h1>
                <hr />
                {CreateMatchDetailForm()}
            </div>
        </Layout>
    );
};

export default CreateMatchDetail;
