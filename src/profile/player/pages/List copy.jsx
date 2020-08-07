import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'

import { isAuth, getCookie } from "../../../auth/AuthHelper";
import Layout from "../../../layout/common/Layout";
import './Profile.css'

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const token = getCookie("token");

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
  const handleDelete = player => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API}/player/delete/${player._id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("PLAYER HAS BEEN DELETED", response);
        toast.error(response.data.message);
        if (response.status === 200) {
          const newList = players.filter(s => s._id !== player._id)
          setPlayers(newList)
        }
      })
      .catch((error) => {
        console.log("PLAYER DELETING ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };
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
              players.map(player => ((player.user.role === 'player') ?
                <tr key={player._id}>
                  <td>{`${player.first_name} ${player.last_name}`}</td>
                  <td>{player.address}</td>
                  <td>{player.contact_number}</td>
                  <td className="text-right">
                    <Link to={`/${isAuth().role}/player-payment/create/${player._id}`} className="btn btn-primary btn-sm mr-2">Add payment</Link>
                    <Link to={`/${isAuth().role}/player/profile/${player._id}`} className="btn btn-success btn-sm mr-2">View player</Link>
                    <Link to={`/${isAuth().role}/player/update/${player._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                  </td>
                </tr> : null
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
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
