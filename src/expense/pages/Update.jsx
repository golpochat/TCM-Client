import React, { useState, useEffect } from "react";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../auth/AuthHelper";
import { Link } from "react-router-dom";
import './Expense.css'

const UpdateExpense = ({ match, history }) => {
    const [values, setValues] = useState({
        amount: 0,
        reference: '',
        type: '',
        btnLabel: "Update",
    });
    const [date, setDate] = useState(new Date());
    const token = getCookie("token");
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/expense/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                // console.log("EXPENSE DETAILS LOADED", response);
                const {
                    amount,
                    reference,
                    type,
                    date,
                } = response.data;
                setDate(date)
                setValues({
                    ...values,
                    amount,
                    reference,
                    type,
                    btnLabel: "Update",
                });

                toast.success(response.data.message);
            })
            .catch((error) => {
                // console.log("PLAYER PROFILE UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const {
        amount,
        reference,
        type,
        btnLabel,
    } = values;
    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Updating" });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/expense/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                amount,
                reference,
                type,
                date,
            },
        })
            .then((response) => {
                // console.log("TEAM DETAILS UPDATED", response);
                toast.error(response.data.message);
                history.push(`/${isAuth().role}/expense/list`);
            })
            .catch((error) => {
                console.log("EXPENSE DETAILS UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updateFrom = () => (
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
                <form>
                    <div className="form-group">
                        <label className="text-muted">Amount</label>
                        <input
                            onChange={handleChange("amount")}
                            type="number"
                            className="form-control"
                            placeholder="Amount"
                            value={amount}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Reference</label>
                        <input
                            onChange={handleChange("reference")}
                            type="text"
                            className="form-control"
                            placeholder="Keep a note for the expense"
                            defaultValue={reference}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Payment type</label>
                        <select className="form-control" name="type" value={type} onChange={handleChange("type")}>
                            <option key="select" value="">Select payment type</option>
                            <option key="cash" value="Cash">Cash</option>
                            <option key="account" value="Account transfer">Acount transfer</option>
                            <option key="card" value="Card">Card</option>
                            <option key="cheque" value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="text-muted">The year team is playing for</div>
                        <DatePicker
                            className="form-control"
                            placeholderText="Click to select a date"
                            selected={new Date(date)}
                            onChange={d => setDate(d)}
                            maxDate={new Date()}
                            dateFormat="dd-mm-yyyy"
                        // isClearable={true}
                        />
                    </div>
                    <Link to={`/admin/expense/list`} className="btn btn-success btn-md mr-3">Back</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-expense-update">
                <h1 className="text-center">Expense Update</h1>
                <hr />
                {updateFrom()}
            </div>
        </Layout>
    );
};

export default UpdateExpense;
