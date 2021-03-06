import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../layout/common/Layout";
import { isAuth, getCookie } from "../../auth/AuthHelper";

const UpdateSponsorPayment = ({ match, history }) => {
    const [values, setValues] = useState({
        amount: 0,
        reference: '',
        type: "",
        btnLabel: "Update",
    });
    const [sponsorID, setSponsorID] = useState([]);
    const [date, setDate] = useState(new Date());
    const token = getCookie("token");
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/sponsor-payment/read/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("SPONSOR PAYMENT LOADED", response);
                const {
                    amount,
                    reference,
                    type,
                } = response.data;
                setDate(response.data.date)
                setSponsorID(response.data.sponsor)
                setValues({
                    ...values,
                    amount,
                    reference,
                    type,
                    date,
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
        btnLabel
    } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };
    const doSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, btnLabel: "Updating" });
        axios({
            method: "PUT",
            url: `${process.env.REACT_APP_API}/sponsor-payment/update/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                amount,
                reference,
                type,
                date,
            },
        })
            .then((response) => {
                // console.log("SPONSOR PAYMENT UPDATED", response);
                toast.error(response.data.message);
                // console.log(sponsorID)
                history.push(`/${isAuth().role}/sponsor/profile/${sponsorID}`);
            })
            .catch((error) => {
                console.log("SPONSOR PAYMENT UPDATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Update" });
                toast.error(error.response.data.error);
            });
    };

    const updatePaymentForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Amount</label>
                <input
                    onChange={handleChange("amount")}
                    type="nubmer"
                    className="form-control"
                    placeholder="Amount"
                    value={amount}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Reference</label>
                <input
                    onChange={handleChange("reference")}
                    type="address"
                    className="form-control"
                    placeholder="Reference"
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
                <div className="text-muted">Date of payment</div>
                <DatePicker
                    className="form-control"
                    placeholderText="Click to select a year"
                    selected={new Date(date)}
                    onChange={date => setDate(date)}
                    maxDate={new Date()}
                    showDatePicker
                    dateFormat="dd-MM-yyyy"
                />
            </div>
            <Link to={`/admin/sponsor/profile/${sponsorID}`} className="btn btn-success btn-md mr-3">Back to profile</Link>
            <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>{btnLabel}</Link>
        </form>
    );
    return (
        <Layout>
            <div className="container-update-sponsor-payment">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mt-5 text-center">Update payment</h1>
                    {updatePaymentForm()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateSponsorPayment;
