import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as moment from 'moment'
import DatePicker from 'react-datepicker'

import { getCookie, isAuth } from "../../auth/AuthHelper";
import Layout from "../../layout/common/Layout";
import './Expense.css'


const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const token = getCookie("token");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dataSet, setDataSet] = useState([]);

    useEffect(() => {
        doSubmit()
    }, [token]);

    const handleDelete = expense => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API}/expense/delete/${expense._id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("EXPENSE HAS BEEN DELETED", response);
                toast.success(response.data.message);
                const newList = expenses.filter(e => e._id !== expense._id)
                setExpenses(newList)
                setDataSet(newList)
            })
            .catch((error) => {
                // console.log("EXPENSE DELETING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };

    const doSubmit = () => {
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
                if (response.data.length > 0) {
                    setExpenses(response.data)
                    setDataSet(response.data)
                    toast.success(`${response.data.length} records found.`);
                }
                else
                    toast.error('Sorry, no record of expense was found.');
            })
            .catch((error) => {
                // console.log("TEAM LOADING ERROR", error.response.data.error);
                toast.error(error.response.data.error);
            });
    };
    const displayExpenseList = () => (
        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="card-title text-success">Total Expense</h2>
                            <hr />
                            <h2>{`€${expenses.reduce((result, expense) => result + expense.amount, 0)}`}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="card-title text-success">Add expense</h2>
                            <hr />
                            <Link to={`/${isAuth().role}/expense/create`} className="btn btn-primary btn-lg btn-block"><i className="fa fa-plus-circle fa-lg" aria-hidden="true"></i></Link>
                        </div>
                    </div>
                </div>
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
                                // peekNextMonth
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
                                // peekNextMonth
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
                        </div>
                    </form>
                </div>

            </div>
            <div className="row mt-5">
                <div className="col-sm-12 col-md-12 col-lg-12 table-responsive">
                    <table className="table display">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Reference</th>
                                <th>Expense type</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                dataSet.map(expense => (
                                    <tr className="odd" key={expense._id}>
                                        <td>{moment(expense.date).format('DD-MM-YYYY')}</td>
                                        <td>{`€${expense.amount}`}</td>
                                        <td>{expense.reference}</td>
                                        <td>{expense.type}</td>
                                        <td className="text-right">
                                            <Link to={`/${isAuth().role}/expense/read/${expense._id}`} className="btn btn-success btn-sm mr-2">View</Link>
                                            <Link to={`/${isAuth().role}/expense/update/${expense._id}`} className="btn btn-warning btn-sm mr-2">Edit</Link>
                                            <Link to='#' onClick={() => { if (window.confirm('Are you sure, you want to delete this record?')) { handleDelete(expense) }; }} className="btn btn-danger btn-sm">Delete</Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment >
    )

    return (
        <Layout>
            <div className="container-expense-list">
                <h1 className="text-center">Expenses</h1>
                <hr />
                {displayExpenseList()}
            </div>
        </Layout >
    );
};

export default ExpenseList;
