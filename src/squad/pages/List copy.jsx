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


const Squad = () => {
    const [squads, setSquads] = useState([]);
    const token = getCookie("token");
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        loadSquads()
    }, []);
    const loadSquads = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/squad/list`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("FOUND SQUAD LIST", response.data);
                toast.success(response.data.message);
                setSquads(response.data)
            })
            .catch((error) => {
                // console.log("SQUAD LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });

    }
    const newList = squads.filter(squad => squad.profile.length > 0)

    const handlePageChange = page => { setCurrentPage(page) };

    // console.log(newList)

    const squadList = paginate(newList, currentPage, pageSize);

    const displaySquad = () => (
        <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Team</th>
                            <th>Opponent</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            squadList.map(squad => (
                                <tr key={squad._id}>
                                    <td>{moment(squad.date).format('DD-MM-YYYY')}</td>
                                    <td>{squad.team.name}</td>
                                    <td style={{ textTransform: "capitalize" }}>{squad.match.opponent}</td>
                                    <td>{squad.status}</td>
                                    <td className="text-right">
                                        <Link to={`/${isAuth().role}/match-detail/create/${squad._id}`} className="btn btn-outline-success btn-sm mr-2">Enter match details</Link>
                                        <Link to={`/${isAuth().role}/squad/view/${squad._id}`} className="btn btn-success btn-sm mr-2">View</Link>
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
                <h1 className="text-center">List of matches to be played</h1>
                <hr />
                <div className="text-right">
                    <Link to={`/${isAuth().role}/match/create`} className="btn btn-primary btn-md mb-3">Add new match</Link>
                </div>
                {displaySquad()}
                <hr />
                {/* <small className="text-muted">Tba: To be announced</small> */}
            </div>
        </Layout>
    );
};

export default Squad;
