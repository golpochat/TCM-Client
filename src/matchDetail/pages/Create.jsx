import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import Layout from "../../layout/common/Layout";
import { getCookie } from "../../auth/AuthHelper";
import './MatchDetail.css'

const CreateMatchDetail = ({ match }) => {
    const [matchDetails, setMatchDetails] = useState([{}])
    const [profiles, setProfiles] = useState([]);
    const token = getCookie("token");
    useEffect(() => {
        loadSquad();
    }, []);

    const loadSquad = () => {
        // loading a squad by match_id
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/squad/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("SQUAD DATA LOADED:", response);
                setProfiles(response.data.profile);
                toast.error(response.data.message);
                // console.log(profiles)

                // loading all the match-details by match_id
                axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API}/match-detail/MatchById/${match.params.id}`,
                    headers: { Authorization: `Bearer ${token}` },
                }).then((response) => {
                    // console.log(response.data)
                    setMatchDetails(response.data);
                }).catch((error) => {
                    // console.log("MATCH_DETAIL LOADING ERROR", error.response.data.error);
                    toast.error(error.response.data.error);
                });
            })
            .catch((error) => {
                // console.log("SQUAD LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });

    }

    profiles.filter((profile) => (
        matchDetails.forEach((matchDetail) => {
            if (matchDetail.profile === profile._id) {
                // console.log(matchDetail._id)
                profile.matchDetailID = matchDetail._id;
                profile.run = matchDetail.run;
                profile.wicket = matchDetail.wicket;
                profile.match_fee = matchDetail.match_fee;
            }
        }
        ))
    )

    const CreateMatchDetailForm = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Run</th>
                            <th>Wicket</th>
                            <th>Match fee</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            profiles.map((player, count) => (
                                <tr key={player._id}>
                                    <td>{count + 1} </td>
                                    <td>{`${player.first_name} ${player.last_name}`}</td>
                                    <td>{player.run || 'not added'}</td>
                                    <td>{player.wicket || 'not added'}</td>
                                    <td>{player.match_fee || 'not added'}</td>
                                    <td>
                                        {player.matchDetailID ?
                                            <Link to={`/admin/match-detail/edit-details/${player.matchDetailID},${match.params.id}`} className='btn btn-outline-warning btn-md'>Edit</Link>
                                            :
                                            <Link to={`/admin/match-detail/add-details/${player._id},${match.params.id}`} className='btn btn-outline-primary btn-md mr-2'>Add</Link>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="m-auto">
                <Link to={`/admin/match/list`} className="btn btn-success btn-md mr-3">Back to match list</Link>
            </div>
        </div>

    );
    return (
        <Layout>
            <div className="container-match-detail-create">
                <h1 className="text-center">Match details entry</h1>
                {CreateMatchDetailForm()}
            </div>
        </Layout>
    );
};

export default CreateMatchDetail;
