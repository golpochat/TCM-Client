import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import Pagination from "../../shared/pagination/Pagination";
import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import paginate from "../../auth/paginate";
import './Match.css'


const Squad = () => {
    const [squads, setSquads] = useState([]);
    const token = getCookie("token");
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 3

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
                // console.log("FOUND SQUAD LIST", response.data);
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
                {squadList.map(squad => (
                    <div className="card mb-3" key={squad._id}>
                        <h5 className="card-header">
                            {`${moment(squad.date).format('Do-MMM-YYYY')}`}
                        </h5>
                        <div className="card-body">
                            <h5 className="card-title">{`Match# ${squad.match.match_no} (${squad.team.name} Vs ${squad.match.opponent})`}</h5>
                            <p className="card-text">
                                {squad.profile.map(player => (
                                    <small className="btn btn-outline-info btn-sm m-1" key={player._id}>
                                        {`${player.first_name} ${player.last_name}`}</small>
                                ))}
                            </p>
                            <Link to={`/${isAuth().role}/match-detail/create/${squad.match._id}`} className="btn btn-success">Enter match detail </Link>
                        </div>
                    </div>
                ))}

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
            </div>
        </Layout>
    );
};

export default Squad;
