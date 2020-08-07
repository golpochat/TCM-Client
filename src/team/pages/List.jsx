import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Team.css'

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const token = getCookie("token");

    useEffect(() => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/team/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND TEAM LIST", response.data);
                setTeams(response.data)
                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("TEAM LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }, [token]);
    const handleDelete = team => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/team/delete/${team._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("TEAM HAS BEEN DELETED", response);
                toast.error(response.data.message);
                if (response.status === 200) {
                    const newList = teams.filter(t => t._id !== team._id)
                    setTeams(newList)
                }
            })
            .catch((error) => {
                console.log("TEAM DELETING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };
    const displayTeamList = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            teams.map(team => (
                                <tr key={team._id}>
                                    <td>{moment(team.year).format('YYYY')}</td>
                                    <td>{team.name}</td>
                                    <td>{team.level}</td>
                                    <td>{team.status === 1 ? "Active" : "Inactive"}</td>
                                    <td className="text-right">
                                        <Link to={`/${isAuth().role}/team/profile/${team._id}`} className="btn btn-success btn-sm mr-2">View team profile</Link>
                                        <Link to={`/${isAuth().role}/team/update/${team._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                                        <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(team) }; }} className="btn btn-danger btn-sm">Delete</Link>
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
            <div className="container-team-list">
                <h1 className="text-center">List of teams</h1>
                <hr />
                <div className="text-right">
                    <Link to={`/${isAuth().role}/team/create`} className="btn btn-primary btn-md mb-3">Add new team</Link>
                </div>
                {displayTeamList()}
            </div>
        </Layout>
    );
};

export default TeamList;
