import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'

import Layout from "../../layout/common/Layout";
import { isAuth, getCookie } from "../../auth/AuthHelper";
import './Tournament.css'
import CardInfo from "../../profile/player/components/CardInfo";
import DisplayTable from "../components/DisplayTable";

const Profile = ({ history, match }) => {
    const [values, setValues] = useState([]);
    const [matches, setMatches] = useState([]);
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
            .then((profile) => {
                const { name, year, status } = profile.data;
                setValues({ name, year, status });
            })
            .catch(() => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error);
                history.push(`/${isAuth().role}/tournament/list`);
            });

        // get all the matches in each tournaments
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match/list-by-tournament/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND MATCH LIST", response.data);
                setMatches(response.data)
            })
            .catch((error) => {
                console.log("MATCH LOADING ERROR", error.response.data.error);
            });
    };

    // All calculation for tournament profile
    const totalMatches = matches.length
    const totalWon = matches.reduce((result, match) => result + (match.result === 'won'), 0)
    const totalLost = matches.reduce((result, match) => result + (match.result === 'lost'), 0)

    const wonMatches = matches.filter(match => match.result === 'won')
    const lostMatches = matches.filter(match => match.result === 'lost')
    const otherMatches = matches.filter(match => match.result !== 'won' && match.result !== 'lost')
    // console.log(otherMatches)

    const profileInfo = () => (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Year of the tournament</td>
                            <td>{moment(values.year).format('YYYY')}</td>
                        </tr>
                        <tr>
                            <td>Tournament status</td>
                            <td>{values.status === 1 ? "On going" : "Finished"}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center">
                    <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/tournament/list`}>Back to tournament list</Link>
                    <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/tournament/update/${match.params.id}`}>Edit</Link>
                </div>
            </div>
        </div >
    );

    const histry = () => (
        <div className="row mt-5">
            <div className="col-md-12">
                <div className="bd-example bd-example-tabs">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="overall-tab" data-toggle="tab" href="#overall" role="tab" aria-controls="overall" aria-selected="true">Overall <span className="badge badge-success">{totalMatches}</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="won-tab" data-toggle="tab" href="#won" role="tab" aria-controls="won" aria-selected="false">Won <span className="badge badge-success">{totalWon}</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="lost-tab" data-toggle="tab" href="#lost" role="tab" aria-controls="lost" aria-selected="false">lost <span className="badge badge-success">{totalLost}</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="others-tab" data-toggle="tab" href="#others" role="tab" aria-controls="others" aria-selected="false">Others <span className="badge badge-success">{otherMatches.length}</span></a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="overall" role="tabpanel" aria-labelledby="overall-tab">
                            <h1 className="text-center m-5">Overall records</h1>
                            <div className="row mb-5">
                                <CardInfo
                                    heading={'Matches'}
                                    value={totalMatches}
                                    isMoney={false}
                                />
                                <CardInfo
                                    heading={'Win'}
                                    value={totalWon}
                                    isMoney={false}
                                />
                                <CardInfo
                                    heading={'Lost'}
                                    value={totalLost}
                                    isMoney={false}
                                />
                            </div>
                            <DisplayTable
                                records={matches}
                            />
                        </div>
                        <div className="tab-pane fade" id="won" role="tabpanel" aria-labelledby="won-tab">
                            <h1 className="text-center m-5">Wining records</h1>
                            <DisplayTable
                                records={wonMatches}
                            />
                        </div>
                        <div className="tab-pane fade" id="lost" role="tabpanel" aria-labelledby="lost-tab">
                            <h1 className="text-center m-5">Loosing records</h1>
                            <DisplayTable
                                records={lostMatches}
                            />
                        </div>
                        <div className="tab-pane fade" id="others" role="tabpanel" aria-labelledby="others-tab">
                            <h1 className="text-center m-5">Others records</h1>
                            <DisplayTable
                                records={otherMatches}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
    return (
        <Layout>
            <div className="container-team-profile">
                <h1 className="text-center">{`${values.name}`}</h1>
                {profileInfo()}
                <hr />
                {histry()}
            </div>
        </Layout>
    );
};

export default Profile;
