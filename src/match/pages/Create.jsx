import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Match.css'
import { useEffect } from "react";

const CreateTeam = ({ history }) => {
    const [values, setValues] = useState({
        tournament: '',
        team: '',
        duration: 20,
        run: 0,
        result: 'tbp',
        opponent: '',
        match_no: 0,
        umpire: '',
        btnLabel: "Create",
    });
    useEffect(() => {
        loadTournaments();
        loadTeams();
    }, []);

    const loadTournaments = () => {
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
    }

    const loadTeams = () => {
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
    }

    const [date, setDate] = useState(new Date())
    const [teams, setTeams] = useState([])
    const [tournaments, setTournaments] = useState([])
    const token = getCookie("token");

    const {
        tournament,
        team,
        duration,
        run,
        result,
        umpire,
        opponent,
        match_no,
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
            url: `${process.env.REACT_APP_API}/match/create`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                tournament,
                team,
                duration,
                opponent,
                match_no,
                run,
                result,
                umpire,
                date
            },
        })
            .then((response) => {
                // console.log("CREATE MATCH", response);
                toast.error(response.data.message);
                history.push(`/${isAuth().role}/match/list`);
            })
            .catch((error) => {
                console.log("CREATE MATCH ERROR", error.response.data.error);

                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const createTeamForm = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">Tournament</label>
                        <select className="form-control" value={tournament} name="tournament" onChange={handleChange("tournament")}>
                            <option key="select" value="">Select one</option>
                            {
                                tournaments.map((tournament) => {
                                    return <option key={tournament._id} value={tournament._id}>{tournament.name}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Team for the match</label>
                        <select className="form-control" value={team} name="team" onChange={handleChange("team")}>
                            <option key="select" value="">Select one</option>
                            {
                                teams.map((team) => {
                                    return <option key={team._id} value={team._id}>{team.name}</option>;
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
                    {/* <div className="form-group">
                        <label className="text-muted">Result</label>
                        <select className="form-control" name="type" value={result} onChange={handleChange("result")}>
                            <option key="select" value="">Select match result</option>
                            <option key="1" value="won">Won</option>
                            <option key="2" value="lost">Lost</option>
                            <option key="3" value="drawn">Drawn</option>
                            <option key="4" value="no result">No result</option>
                            <option key="5" value="abandoned">Abandoned</option>
                            <option key="6" value="tbp">To be played</option>
                        </select>
                    </div> */}
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
                        <label className="text-muted">Umpire</label>
                        <select className="form-control" name="type" value={umpire} onChange={handleChange("umpire")}>
                            <option key="select" value="">Select umpire type</option>
                            <option key="official" value="official">Official</option>
                            <option key="unofficial" value="unofficial">Unofficial</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="text-muted">Date of match</div>
                        <DatePicker
                            className="form-control"
                            placeholderText="Click to select a year"
                            selected={date}
                            onChange={d => setDate(d)}
                            // maxDate={new Date()}
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
            <div className="container-team-create">
                <h1 className="text-center">Create match</h1>
                <hr />
                {createTeamForm()}
            </div>
        </Layout>
    );
};

export default CreateTeam;
