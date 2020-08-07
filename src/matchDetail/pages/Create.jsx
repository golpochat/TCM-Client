import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Button from 'react-bootstrap/Button';

import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "../../auth/AuthHelper";
import './MatchDetail.css'

const CreateMatchDetail = ({ match }) => {
    const [values, setValues] = useState({
        profile: '',
        run: 0,
        wicket: 0,
        match_fee: 5,
        // btnLabel: "Create",
    });
    const [matchDetails, setMatchDetails] = useState([{}])
    const [profiles, setProfiles] = useState([{}]);
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
            })
            .catch((error) => {
                // console.log("SQUAD LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });

        // loading all the match-details by match_id
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match-detail/matchById/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                // console.log("MATCH-DETAIL DATA LOADED:", response.data);
                setMatchDetails(response.data);
                toast.error(response.data.message);
                // console.log(matchDetails)
            })
            .catch((error) => {
                // console.log("SQUAD LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }

    console.log(matchDetails)
    console.log(profiles)
    // const allDetails = [...profiles, ...matchDetails]
    // const allDetails = profiles.concat(matchDetails)
    // setProfiles(allDetails)
    // console.log(allDetails)

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
                                    <td>{`${count + 1}`}</td>
                                    <td>{`${player.first_name} ${player.last_name}`}</td>
                                    {/* <td>{console.log(matchDetails.find(match => match.profile === player._id))}</td> */}
                                    <td>{16}</td>
                                    <td>{3}</td>
                                    <td>{5}</td>
                                    <td>
                                        <Link to={`/admin/match-detail/add-details/${player._id},${match.params.id}`} className='btn btn-outline-primary btn-md mr-2'>Add</Link>
                                        <Link to={`/admin/match-detail/edit-details/${player._id},${match.params.id}`} className='btn btn-outline-warning btn-md'>Edit</Link>
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
