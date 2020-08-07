// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import * as moment from 'moment'

// import Layout from "../../layout/common/Layout";
// import { isAuth, getCookie } from "../../auth/AuthHelper";
// import './Expense.css'

// const Profile = ({ history, match }) => {
//     const [values, setValues] = useState([]);
//     const token = getCookie("token");

//     useEffect(() => {
//         loadProfile();
//     }, []);

//     const loadProfile = () => {
//         axios({
//             method: "GET",
//             url: `${process.env.REACT_APP_API}/team/read/${match.params.id}`,
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((profile) => {
//                 // console.log(profile)
//                 // axios({
//                 //     method: "GET",
//                 //     url: `${process.env.REACT_APP_API}/sponsor-payment/all/${match.params.id}`,
//                 //     headers: { Authorization: `Bearer ${token}` },
//                 // })
//                 //     .then((payments) => {
//                 //         setPayments(payments.data)
//                 //     })
//                 //     .catch((error) => {
//                 //         console.log('NO PAYMENT LOGS FOUND')
//                 //         // toast.error(error.data.error)
//                 //     })

//                 const {
//                     name,
//                     level,
//                     year,
//                 } = profile.data;

//                 setValues({
//                     name,
//                     level,
//                     year,
//                 });
//             })
//             .catch(() => {
//                 // console.log("PLAYER PROFILE UPDATE ERROR", error);
//                 history.push(`/${isAuth().role}/profile/list`);
//             });
//     };
//     const profileInfo = () => (
//         <div className="row">
//             <div className="col-lg-12 col-md-12 col-sm-12 m-auto">
//                 <table className="table">
//                     <tbody>
//                         <tr>
//                             <td>Level</td>
//                             <td>{values.level}</td>
//                         </tr>
//                         <tr>
//                             <td>Playing since</td>
//                             <td>{moment(values.year).format('YYYY')}</td>
//                         </tr>
//                         <tr>
//                             <td>Status</td>
//                             <td>{values.status === 1 ? "Active" : "Inactive"}</td>
//                         </tr>
//                     </tbody>
//                 </table>
//                 <div className="text-center">
//                     <Link className="btn btn-success btn-md mr-2" to={`/${isAuth().role}/team/list`}>Back to list</Link>
//                     <Link className="btn btn-warning btn-md" to={`/${isAuth().role}/team/update/${match.params.id}`}>Edit</Link>
//                 </div>
//             </div>
//         </div >
//     );
//     const TeamSummary = () => (
//         <div className="row">
//             <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                     <div className="card-body text-center">
//                         <h2 className="card-title text-success">Game</h2>
//                         <hr />
//                         <h2>25</h2>
//                     </div>
//                 </div>
//             </div>
//             <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                     <div className="card-body text-center">
//                         <h2 className="card-title text-success">Win</h2>
//                         <hr />
//                         <h2>15</h2>
//                     </div>
//                 </div>
//             </div>
//             <div className="col-sm-12 col-md-6 col-lg-4">
//                 <div className="card">
//                     <div className="card-body text-center">
//                         <h2 className="card-title text-success">Lost</h2>
//                         <hr />
//                         <h2>10</h2>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const OverallTeamHistry = () => (
//         <div className="row">
//             <div className="col-sm-12 col-md-12 col-lg-12">
//                 <nav>
//                     <div className="nav nav-tabs" id="nav-tab" role="tablist">
//                         <Link className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" to="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true"><strong>Overall</strong></Link>
//                         <Link className="nav-item nav-link" id="nav-win-tab" data-toggle="tab" to="#nav-win" role="tab" aria-controls="nav-win" aria-selected="false"><strong>Win</strong></Link>
//                         <Link className="nav-item nav-link" id="nav-lost-tab" data-toggle="tab" to="#nav-contact" role="tab" aria-controls="nav-lost" aria-selected="false"><strong>Lost</strong></Link>
//                         <Link className="nav-item nav-link" id="nav-noresult-tab" data-toggle="tab" to="#nav-contact" role="tab" aria-controls="nav-noresult" aria-selected="false"><strong>No result</strong></Link>
//                     </div>
//                 </nav>
//                 <div className="tab-content" id="nav-tabContent">
//                     <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">1</div>
//                     <div className="tab-pane fade" id="nav-win" role="tabpanel" aria-labelledby="nav-win-tab">2</div>
//                     <div className="tab-pane fade" id="nav-lost" role="tabpanel" aria-labelledby="nav-lost-tab">3</div>
//                     <div className="tab-pane fade" id="nav-noresult" role="tabpanel" aria-labelledby="nav-noresult-tab">4</div>
//                 </div>
//             </div>
//         </div>
//     )
//     return (
//         <Layout>
//             <div className="container-team-profile">
//                 <h1 className="text-center">{`${values.name}`}</h1>
//                 <hr />
//                 {profileInfo()}
//                 <hr />
//                 {TeamSummary()}
//                 <hr />
//                 {OverallTeamHistry()}
//             </div>
//         </Layout>
//     );
// };

// export default Profile;
