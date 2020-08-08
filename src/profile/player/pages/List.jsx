import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { isAuth, getCookie } from "../../../auth/AuthHelper";
import Layout from "../../../layout/common/Layout";
import Pagination from "../../../shared/pagination/Pagination";
import './Profile.css'
import paginate from "../../../auth/paginate";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const token = getCookie("token");
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/player/list`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        // console.log("FOUND PLAYER LIST", response.data);
        setPlayers(response.data)
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("PLAYER LOADING ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  }, [token]);

  // const newList = squads.filter(squad => squad.profile.length > 0)

  const handlePageChange = page => { setCurrentPage(page) };

  // console.log(newList)

  const playerList = paginate(players, currentPage, pageSize);

  const displayPlayerList = () => (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              playerList.map(player => ((player.user.role === 'player') ?
                <tr key={player._id}>
                  <td>{`${player.first_name} ${player.last_name}`}</td>
                  <td>{player.address}</td>
                  <td>{player.contact_number}</td>
                  <td className="text-right">
                    <Link to={`/admin/player-payment/create/${player._id}`} className="btn btn-primary btn-sm mr-2">Add payment</Link>
                    <Link to={`/admin/player/profile-admin-view/${player._id}`} className="btn btn-success btn-sm mr-2">View player</Link>
                  </td>
                </tr> : null
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="m-auto">
        <Pagination
          itemsCount={players.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div >
  );
  return (
    <Layout>
      <div className="container-player-list">
        <h1 className="text-center">List of players</h1>
        {displayPlayerList()}
      </div>
    </Layout>
  );
};

export default PlayerList;
