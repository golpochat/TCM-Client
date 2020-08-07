import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as moment from 'moment'
import { toast } from "react-toastify";

import { isAuth, getCookie } from "../../../auth/AuthHelper";
import Layout from "../../../layout/common/Layout";
import Avatar from '../../../shared/avatar/Avatar'
import PaymentTable from "../components/Payment";
import History from "../components/History";
import Ranking from "../components/Ranking";
import CardInfo from "../components/CardInfo";
import './Profile.css'

const Profile = ({ history, match }) => {
  const [values, setValues] = useState([]);
  const token = getCookie("token");

  const [registrationBills, setRegistrationBills] = useState([]);
  const [fees, setFees] = useState([]);
  const [profileID, setProfileID] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/admin/player/profile-admin-view/${match.params.id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((profile) => {
        // console.log(profile)
        const {
          first_name,
          last_name,
          address,
          contact_number,
          joining_year,
          level,
          image,
          status
        } = profile.data;
        const { role, email } = profile.data.user;
        setProfileID(profile.data._id)
        setValues({
          role,
          email,
          first_name,
          last_name,
          address,
          contact_number,
          joining_year,
          level,
          image,
          status
        });
        // registration payment
        axios({
          method: "GET",
          url: `${process.env.REACT_APP_API}/registration/payment-list/${profile.data._id}`,
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((register) => {
            // console.log(register.data)
            setRegistrationBills(register.data)
          })
          .catch((err) => {
            toast.error('Something went wrong with your registration, please contact with admin');
          })

        // match fee
        axios({
          method: "GET",
          url: `${process.env.REACT_APP_API}/match-detail/fee-list/${profile.data._id}`,
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((fees) => {
            // console.log(fees.data)
            setFees(fees.data)
          })
          .catch((err) => {
            toast.error('Something went wrong with your registration, please contact with admin');
          })

        // get payment data
        axios({
          method: "GET",
          url: `${process.env.REACT_APP_API}/player-payment/list/${profile.data._id}`,
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((playerPayments) => {
            // console.log(payments)
            setPayments(playerPayments.data)
          })
          .catch(() => {
            toast.error('Something went wrong with your payments, please contact to admin');
          })
      })
      .catch(() => {
        // console.log("PLAYER PROFILE UPDATE ERROR", error);
        history.push(`/${isAuth().role}/profile/create`);
      });
  };

  // All payment calculation
  const amountFromRegistration = registrationBills.reduce((result, bill) => result + bill.fee, 0)
  const amountFromMatchFee = fees.reduce((result, fee) => result + fee.match_fee, 0)
  const paidAmount = payments.reduce((result, payment) => result + payment.amount, 0)
  const totalAmount = amountFromRegistration + amountFromMatchFee
  const outstanding = totalAmount - paidAmount

  // All carrier records calculation
  const totalRun = fees.reduce((result, match) => result + match.run, 0)
  const totalWicket = fees.reduce((result, match) => result + match.wicket, 0)

  // All about ranking
  const rankings = [{}]

  const profileInfo = () => (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6 text-center mt-3">
        <Avatar img={values.image} />
      </div>
      <div className="col-sm-12 col-md-12 col-lg-6 m-auto">
        <table className="table mt-3">
          <tbody>
            <tr>
              <td>Role</td>
              <td style={{ textTransform: "capitalize" }}>{values.role}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{values.address}</td>
            </tr>
            <tr>
              <td>Contact number</td>
              <td>{values.contact_number}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{values.email}</td>
            </tr>
            <tr>
              <td>Joining year</td>
              <td>{moment(values.joining_year).format('YYYY')}</td>
            </tr>
            <tr>
              <td>Level of Professionalism</td>
              <td>{values.level}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  );

  const histry = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="bd-example bd-example-tabs">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="history-tab" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">History</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="payment-tab" data-toggle="tab" href="#payment" role="tab" aria-controls="payment" aria-selected="false">Payment</a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <h1 className="text-center m-5">Ranking</h1>
              <div className="row mb-5">
                <CardInfo
                  heading={'Batsman'}
                  value={5}
                  isMoney={false}
                />
                <CardInfo
                  heading={'Bowler'}
                  value={7}
                  isMoney={false}
                />
                <CardInfo
                  heading={'Allrounder'}
                  value={3}
                  isMoney={false}
                />
              </div>
              {/* <Ranking records={rankings} /> */}
            </div>
            <div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab">
              <h1 className="text-center m-5">Carrier records</h1>
              <div className="row mb-5">
                <CardInfo
                  heading={'Run'}
                  value={totalRun}
                  isMoney={false}
                />
                <CardInfo
                  heading={'Wicket'}
                  value={totalWicket}
                  isMoney={false}
                />
                <CardInfo
                  heading={'Match fee'}
                  value={amountFromMatchFee}
                  isMoney={true}
                />
              </div>
              <History records={fees} />
            </div>
            <div className="tab-pane fade" id="payment" role="tabpanel" aria-labelledby="payment-tab">
              <h1 className="text-center m-5">List of payments</h1>
              <div className="row mb-5">
                <CardInfo
                  heading={'Total'}
                  value={totalAmount}
                  isMoney={true}
                />
                <CardInfo
                  heading={'Paid'}
                  value={paidAmount}
                  isMoney={true}
                />
                <CardInfo
                  heading={'Outstanding'}
                  value={outstanding}
                  isMoney={true}
                />
              </div>
              <div className="text-right mb-3">
                <Link to={`/admin/player-payment/create/${profileID}`} className="btn btn-primary btn-md">Add payment</Link>
              </div>
              <PaymentTable playerPayments={payments} />
            </div>
          </div>
        </div>
      </div>
    </div >
  )

  return (
    <Layout>
      <div className="container-profile">
        <h1 className="text-lead text-center">{`${values.first_name} ${values.last_name}`}</h1>
        <hr />
        {profileInfo()}
        <hr />
        {histry()}
      </div>
    </Layout>
  );
};

export default Profile;
