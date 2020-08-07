import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Tournament.css'

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);
    const token = getCookie("token");

    useEffect(() => {
        loadTournaments()
    }, []);
    const loadTournaments = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/tournament/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND TEAM LIST", response.data);
                setTournaments(response.data)
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("TEAM LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }
    const handleDelete = tournament => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/tournament/delete/${tournament._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("TOURNAMENT HAS BEEN DELETED", response);
                toast.error(response.data.message);
                if (response.status === 200) {
                    const newList = tournaments.filter(t => t._id !== tournament._id)
                    setTournaments(newList)
                }
            })
            .catch((error) => {
                console.log("TOURNAMENT DELETING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };
    const displayTournament = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tournaments.map(tournament => (
                                <tr key={tournament._id}>
                                    <td>{moment(tournament.year).format('YYYY')}</td>
                                    <td>{tournament.name}</td>
                                    <td>{tournament.status === 1 ? "Active" : "Inactive"}</td>
                                    <td className="text-right">
                                        <Link to={`/${isAuth().role}/tournament/profile/${tournament._id}`} className="btn btn-success btn-sm mr-2">View tournament</Link>
                                        <Link to={`/${isAuth().role}/tournament/update/${tournament._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                                        <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(tournament) }; }} className="btn btn-danger btn-sm">Delete</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-tournament-list">
                <h1 className="text-center">List of tournaments</h1>
                <hr />
                <div className="text-right">
                    <Link to={`/${isAuth().role}/tournament/create`} className="btn btn-primary btn-md mb-3">Add new tournament</Link>
                </div>
                {displayTournament()}
            </div>
        </Layout>
    );
};

export default Tournament;
