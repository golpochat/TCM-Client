import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import Pagination from "../../shared/pagination/Pagination";
import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import paginate from "../../auth/paginate";
import './Squad.css'


const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const token = getCookie("token");
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/match/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("FOUND MATCH LIST", response.data);
                toast.success(response.data.message);
                setMatches(response.data)
            })
            .catch((error) => {
                console.log("MATCH LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    }, [token]);

    const handleDelete = match => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/match/delete/${match._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("MATCH HAS BEEN DELETED", response);
                if (response.status === 200) {
                    toast.error(response.data.message);
                    const newList = matches.filter(m => m._id !== match._id)
                    setMatches(newList)
                }
            })
            .catch((error) => {
                console.log("MATCH DELETING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };
    const handlePageChange = page => {
        setCurrentPage(page)
    };
    const newList = matches.filter(match => (match.squad === undefined))
    // setMatches(newList)
    // console.log(newList)
    const matchesList = paginate(newList, currentPage, pageSize);

    const displayMatchList = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Tournament</th>
                            <th>Team</th>
                            <th>Opponent</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            matchesList.map(match => (
                                <tr key={match._id}>
                                    <td>{moment(match.date).format('DD-MM-YYYY')}</td>
                                    <td>{match.tournament.name}</td>
                                    <td>{match.team ? match.team.name : 'Tba'}</td>
                                    <td style={{ textTransform: "capitalize" }}>{match.opponent}</td>
                                    <td className="text-right">
                                        <Link to={`/${isAuth().role}/squad/create/${match._id}`} className="btn btn-outline-success btn-sm mr-2">Assign squad</Link>
                                        <Link to={`/${isAuth().role}/match/profile/${match._id}`} className="btn btn-success btn-sm mr-2">View</Link>
                                        <Link to={`/${isAuth().role}/match/update/${match._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                                        <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(match) }; }} className="btn btn-danger btn-sm">Delete</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="m-auto">
                <Pagination
                    itemsCount={newList.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-match-list">
                <h1 className="text-center">List of matches to be assigned</h1>
                <hr />
                <div className="text-right">
                    <Link to={`/${isAuth().role}/match/create`} className="btn btn-primary btn-md mb-3">Add new match</Link>
                </div>
                {displayMatchList()}
            </div>
        </Layout>
    );
};

export default MatchList;