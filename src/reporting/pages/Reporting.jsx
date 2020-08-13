import React, { useState, useEffect, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import { useReactToPrint } from 'react-to-print';

import TableReport from "../components/TableReport";
import { getCookie } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import CardInfo from "../components/CardInfo";
import './Reporting.css'



const ExpenseList = () => {
    const token = getCookie("token");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [expenses, setExpenses] = useState([]);
    const [playerPayments, setPlayerPayments] = useState([]);
    const [sponsorPayments, setSponsorPayments] = useState([]);

    useEffect(() => {
        doSubmit()
    }, [token]);

    const doSubmit = () => {
        // for all expenses
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/expense/list`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                startDate, endDate
            },
        })
            .then((response) => {
                // console.log("FOUND EXPENSE LIST", response.data);
                setExpenses(response.data)
            })
            .catch((error) => {
                // console.log("TEAM LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });

        // for all player payments
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/player-payment/all-payment`,
            headers: { Authorization: `Bearer ${token}` },
            data: { startDate, endDate },
        })
            .then((response) => {
                // console.log("FOUND PLAYER PAYMENT LIST", response.data);
                setPlayerPayments(response.data)
            })
            .catch((error) => {
                // console.log("PLAYER PAYMENT LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });

        // for all sponsor payments
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/sponsor-payment/all-payment`,
            headers: { Authorization: `Bearer ${token}` },
            data: { startDate, endDate },
        })
            .then((response) => {
                console.log("FOUND SPONSOR PAYMENT LIST", response.data);
                setSponsorPayments(response.data)
            })
            .catch((error) => {
                // console.log("SPONSOR PAYMENT LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };

    // Expense & income calculation
    const totalExpenses = expenses.reduce((result, expense) => result + expense.amount, 0)
    const totalPlayerPayments = playerPayments.reduce((result, payment) => result + payment.amount, 0)
    const totalSponsorPayments = sponsorPayments.reduce((result, payment) => result + payment.amount, 0)
    const totalIncome = totalPlayerPayments + totalSponsorPayments
    const displayExpenseList = () => (
        <Fragment>
            <div className="row">
                <CardInfo
                    heading={'Total expenses'}
                    value={totalExpenses}
                    isMoney={true}
                />
                <CardInfo
                    heading={'Total income'}
                    value={totalIncome}
                    isMoney={true}
                />
            </div>

            <div className="row mt-5">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <form>
                        <div className="form-group">
                            <label className="text-muted">Start date</label>
                            <DatePicker
                                className="form-control"
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                showWeekNumbers
                                showMonthDropdown
                                showYearDropdown
                                dateFormat="dd-MM-yyyy"
                                maxDate={new Date()}
                                dropdownMode="select"
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted">End Date</label>
                            <DatePicker
                                className="form-control"
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                showWeekNumbers
                                showMonthDropdown
                                showYearDropdown
                                dateFormat="dd-MM-yyyy"
                                maxDate={new Date()}
                                dropdownMode="select"
                            />
                        </div>
                        <div className="text-right">
                            <Link className="btn btn-outline-success btn-lg btn-block" to="#" onClick={doSubmit}>Get data</Link>
                            <Link className="btn btn-outline-info btn-lg btn-block" to='#' onClick={handlePrint}>Print <i className="fa fa-print" aria-hidden="true"></i></Link>
                        </div>
                    </form>
                </div>

            </div>
            <div className="row mt-5">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h3>List of expenses</h3>
                    <TableReport
                        records={expenses}
                    />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 mt-5">
                    <h3>List of player payments</h3>
                    <TableReport
                        records={playerPayments}
                    />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 mt-5">
                    <h3>List of sponsor payments</h3>
                    <TableReport
                        records={sponsorPayments}
                    />
                </div>
            </div>
        </Fragment >
    )

    // for media printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    class ComponentToPrint extends React.Component {
        render() {
            return (
                <div className="container">
                    {displayExpenseList()}
                </div>
            );
        }
    }
    // end of media printing


    return (
        <Layout>
            <div className="container-expense-list">
                <h1 className="text-center">TCM Reporting</h1>
                <hr />
                <ComponentToPrint ref={componentRef} />
            </div>
        </Layout >
    );
};

export default ExpenseList;
