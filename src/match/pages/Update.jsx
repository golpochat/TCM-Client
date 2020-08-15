import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";
import './Match.css'
const UpdateTeam = ({ match, history }) => {
    const [values, setValues] = useState({
        tournament: '',
        team: '',
        opponent: '',
        match_no: '',
        duration: 0,
        run: 0,
        result: '',
        umpire: '',
        btnLabel: "Update",
    });
    const [date, setDate] = useState(new Date());
    const [teams, setTeams] = useState([])
    const [tournaments, setTournaments] = useState([])
    const token = getCookie("token");
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("MATCH DETAILS LOADED", response);
                const {
                    tournament,
                    team,
                    opponent,
                    match_no,
                    duration,
                    run,
                    result,
                    umpire,
                    date,
                } = response.data;
                setDate(date)
                setValues({
                    ...values,
                    tournament,
                    team,
                    opponent,
                    match_no,
                    duration,
                    run,
                    result,
                    umpire,
                    btnLabel: "Update",
                });

                // loading all the tournaments
                axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API}/tournament/list`,
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((tournament) => {
                        // console.log("TOURNAMENT LOADED", tournament);
                        setTournaments(tournament.data)
                        // toast.error(tournament.data.message);
                    })
                    .catch((error) => {
                        // console.log("TOURNAMENT LOADING ERROR", error.tournament.data.error);
                        toast.error(error.tournament.data.error);
                    });

                // loading all the teams
                axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API}/team/list`,
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((response) => {
                        // console.log("TEAM LOADED", response);
                        setTeams(response.data)
                        toast.error(response.data.message);
                    })
                    .catch((error) => {
                        // console.log("TEAM LOADING ERROR", error.response.data.error);
                        toast.error(error.response.data.error);
                    });

                toast.success(response.data.message);
            })
            .catch((error) => {
                console.log("MATCH DETAILS UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const {
        tournament,
        team,
        opponent,
        match_no,
        duration,
        run,
        result,
        umpire,
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
            url: `${process.env.REACT_APP_API}/match/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                tournament,
                team,
                opponent,
                match_no,
                duration,
                run,
                result,
                umpire,
                date,
            },
        })
            .then((response) => {
                // console.log("TEAM DETAILS UPDATED", response);
                toast.error(response.data.message);
                // history.push(`/${isAuth().role}/team/profile/${match.params.id}`);
                history.push(`/${isAuth().role}/match/list`);
            })
            .catch((error) => {
                console.log("MATCH DETAILS UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">Tournament</label>
                        <select className="form-control" value={tournament} name="tournament" onChange={handleChange("tournament")}>
                            <option key="select" value="">Select one</option>
                            {
                                tournaments.map((tournament) => <option key={tournament._id} value={tournament.name}>{tournament.name}</option>)
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Team for squad</label>
                        <select className="form-control" value={team} name="team" onChange={handleChange("team")}>
                            <option key="select" value="">Select one</option>
                            {
                                teams.map((team) => {
                                    return <option key={team._id} value={team.name}>{team.name}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Match duration</label>
                        <input
                            onChange={handleChange("duration")}
                            type="number"
                            className="form-control"
                            placeholder="Duration of the match"
                            value={duration}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Run</label>
                        <input
                            onChange={handleChange("run")}
                            type="number"
                            className="form-control"
                            placeholder="Total run of the match"
                            value={run}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Opponent</label>
                        <input
                            onChange={handleChange("opponent")}
                            type="text"
                            className="form-control"
                            placeholder="Name of the opponent"
                            value={opponent}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Match number</label>
                        <input
                            onChange={handleChange("match_no")}
                            type="number"
                            className="form-control"
                            placeholder="Number of the match"
                            value={match_no}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Result</label>
                        <select className="form-control" name="type" value={result} onChange={handleChange("result")}>
                            <option key="select" value="">Select match result</option>
                            <option key="1" value="Won">Won</option>
                            <option key="2" value="Lost">Lost</option>
                            <option key="3" value="Drawn">Drawn</option>
                            <option key="4" value="No result">No result</option>
                            <option key="5" value="Abandoned">Abandoned</option>
                            <option key="6" value="tbp">To be played</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Umpire</label>
                        <select className="form-control" name="type" value={umpire} onChange={handleChange("umpire")}>
                            <option key="select" value="">Select umpire type</option>
                            <option key="official" value="Official">Official</option>
                            <option key="unofficial" value="unofficial">Unofficial</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="text-muted">Date of match</div>
                        <DatePicker
                            className="form-control"
                            placeholderText="Click to select a year"
                            selected={new Date(date)}
                            onChange={d => setDate(d)}
                            maxDate={new Date()}
                            showDatePicker
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                    <Link to={`/admin/match/list`} className="btn btn-success btn-md mr-3">Back to match list</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-match-update">
                <h1 className="text-center">Match Update</h1>
                <hr />
                {updateFrom()}
            </div>
        </Layout>
    );
};

export default UpdateTeam;
