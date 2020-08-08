import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import TableAllrounderRanking from "../components/TableAllrounderRanking";
import TableBatsmanRanking from "../components/TableBatsmanRanking";
import TableBowlerRanking from "../components/TableBowlerRanking";
import Layout from "../../layout/common/Layout";
import './Ranking.css'

const Ranking = () => {

  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    loadMatchDetails()
  }, []);

  const loadMatchDetails = () => {
    // for all expenses
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/match-detail/all`,
    })
      .then((response) => {
        // console.log("FOUND EXPENSE LIST", response.data);
        setRankings(response.data)
      })
      .catch((error) => {
        // console.log("TEAM LOADING ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const displayRanking = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="bd-example bd-example-tabs">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="allrounder-tab" data-toggle="tab" href="#allrounder" role="tab" aria-controls="allrounder" aria-selected="true">Allrounder</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="batsman-tab" data-toggle="tab" href="#batsman" role="tab" aria-controls="batsman" aria-selected="false">Batsman</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="bowler-tab" data-toggle="tab" href="#bowler" role="tab" aria-controls="bowler" aria-selected="false">Bowler</a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="allrounder" role="tabpanel" aria-labelledby="allrounder-tab">
              <h1 className="text-center m-5">Allrounder ranking</h1>
              <div className="row mb-5">
                <TableAllrounderRanking records={rankings} />
              </div>
            </div>
            <div className="tab-pane fade" id="batsman" role="tabpanel" aria-labelledby="batsman-tab">
              <h1 className="text-center m-5">Batsman ranking</h1>
              <div className="row mb-5">
                <TableBatsmanRanking records={rankings} />
              </div>
            </div>
            <div className="tab-pane fade" id="bowler" role="tabpanel" aria-labelledby="bowler-tab">
              <h1 className="text-center m-5">Bowler ranking</h1>
              <div className="row mb-5">
                <TableBowlerRanking records={rankings} />
              </div>
            </div>
          </div>
        </div>
      </div >
    </div>
  )

  return (
    <Layout>
      <div className="container-expense-list">
        <h1 className="text-center">TCM Ranking</h1>
        <hr />
        {displayRanking()}
      </div>
    </Layout >
  );
};

export default Ranking;
