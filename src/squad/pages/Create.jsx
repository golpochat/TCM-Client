import React, { useState, useEffect } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Squad.css'


const CreateSquad = ({ match, history }) => {
    const [values, setValues] = useState({
        squadSize: 1,
        opponent: '',
        team: '',
        profiles: [],
        status: 'playing',
        btnLabel: "Create",
    });
    const [date, setDate] = useState(new Date());
    const token = getCookie("token");
    const [matchDetail, setMatchDetail] = useState([])
    const [players, setPlayers] = useState([])

    useEffect(() => {
        loadTeams()
        loadPlayers()
    }, [])
    const loadTeams = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("MATCH LOADED", response);
                setMatchDetail(response.data)
                toast.error(response.data.message);
            })
            .catch((error) => {
                // console.log("TEAM LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }
    const loadPlayers = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/player/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("PROFILE LOADED", response);
                // toast.success(response.data.message);
                setPlayers(response.data.filter(p => p.user.role === 'player'))
            })
            .catch((error) => {
                // console.log("SQUAD CREATE ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }

    const {
        opponent,
        status,
        team,
        profiles,
        btnLabel
    } = values;
    const handleChange = (name) => (event) => {
        console.log(event.target.checked)
        // console.log(event.target.type)
        if ((event.target.type === "checkbox")) {
            if (event.target.checked) {
                values.profiles.push(event.target.value);
            }
            else {
                values.profiles.pop(event.target.value);
            }
        }
        else
            setValues({ ...values, [name]: event.target.value });
        // console.log(values)
    };
    const doSubmit = (event) => {
        event.preventDefault();
        if (values.profiles.length < values.squadSize) {
            toast.error(`You must choose ${values.squadSize} players, you picked ${values.profiles.length}.`)
            return;
        }
        if (values.profiles.length > values.squadSize) {
            toast.error(`You are allowed to choose ${values.squadSize} players max, you picked ${values.profiles.length}.`)
            return;
        }
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/squad/create/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: { date, match: matchDetail, team: matchDetail.team, profile: profiles, status },
        })
            .then((response) => {
                // console.log("SQUAD UPDATE", response);
                toast.error(response.data.message);
                setValues({ ...values, btnLabel: "Created" });
                history.push(`/${isAuth().role}/match/list`);
            })
            .catch((error) => {
                // console.log("SQUAD CREATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Create" });
                toast.error(error.response.data.error);
            });
    };

    const createForm = () => (
        <form>
            {/* <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                        <label className="text-muted">Team for squad</label>
                        <select className="form-control" name="team" onChange={handleChange("team")}>
                            <option key="select" value="">Select one</option>
                            {
                                teams.map((team) => {
                                    return <option key={team._id} value={team._id}>{team.name}</option>;
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                        <label className="text-muted">Dat of the match</label>
                        <DatePicker
                            className="form-control"
                            placeholderText="Click to select a year"
                            selected={date}
                            onChange={d => setDate(d)}
                            dateFormat="dd-MM-yyyy"
                        // isClearable={true}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <label className="text-muted">Opponent</label>
                        <input
                            type="text"
                            name="opponent"
                            placeholder="Name of opponent team"
                            className="form-control"
                            onChange={handleChange('opponent')}
                            value={opponent}
                        />
                    </div>
                </div>
            </div>
            <hr /> */}
            <div className="row m-auto">
                {
                    players.map(player =>
                        <div className="squad-card m-3 responsive" key={player._id}>
                            <div className="row m-auto">
                                <div className="col-sm-12 col-md-12 col-lg-12 m-2">
                                    <h4>{player.first_name + ' ' + player.last_name}</h4>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <img className="card-profile-image" src={`${process.env.REACT_APP_API}/uploads/images/${player.image}`} alt="profile" />
                                </div>
                                <div className="col-sm-7 col-md-7 col-lg-7">
                                    <p className="m-0 p-0">Contact: {player.contact_number}</p>
                                    <p className="m-0 p-0"> Level: {player.level}</p>
                                    <p className="m-0 p-0"> Availablity: {player.status}</p>
                                    <div className="form-check mt-3" style={{ fontSize: '20px' }}>
                                        <input type="checkbox" style={{ marginTop: '10px' }} className="form-check-input" id="pickme"
                                            // name={player._id}
                                            // checked={player._id}
                                            onChange={handleChange('profile')}
                                            value={player._id}
                                        />
                                        <label className="form-check-label" htmlFor="pickme">Pick me</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <hr />
            <div className="row mt-5 text-center">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <Link to={`/admin/squad/list`} className="btn btn-success btn-md mr-3">Back to match list</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>{btnLabel}</Link>
                </div>
            </div>
        </form >
    );
    return (
        <Layout>
            <div className="container-squad-create">
                <h1 className="text-center">Create Playing Squad</h1>
                <hr />
                {createForm()}
            </div>
        </Layout>
    );
};

export default CreateSquad;
