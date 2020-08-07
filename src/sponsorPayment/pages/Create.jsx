import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/common/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { isAuth, getCookie } from "../../auth/AuthHelper";
import './SponsorPayment.css'

const CreateSponsorPayment = ({ history, match }) => {
    const [values, setValues] = useState({
        amount: 0,
        reference: '',
        type: '',
        btnLabel: "Create",
    });
    const [date, setDate] = useState(new Date())
    const token = getCookie("token");
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
        setValues({ ...values, btnLabel: "Creating" });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/sponsor-payment/create/${match.params.id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                amount,
                reference,
                type,
                date,
            },
        })
            .then((response) => {
                // console.log("PLAYER PROFILE CREATE SUCCESSFULL", response);
                history.push(`/${isAuth().role}/sponsor/profile/${match.params.id}`);
            })
            .catch((error) => {
                // console.log("PLAYER PROFILE CREATE ERROR", error.response.data.error);
                setValues({ ...values, btnLabel: "Create" });
                // alert('error')
                toast.error(error.response.data.error);
            });
    };

    const CreatePaymentForm = () => (
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
                            placeholder="Reference"
                            value={reference}
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
                            selected={date}
                            onChange={date => setDate(date)}
                            maxDate={new Date()}
                            showDatePicker
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                    <Link to={`/admin/sponsor/profile/${match.params.id}`} className="btn btn-success btn-md mr-3">Back</Link>
                    <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit}>
                        {btnLabel}
                    </Link>
                </form>
            </div>
        </div>
    );
    return (
        <Layout>
            <div className="container-create-sponsor-payment">
                <h1 className="mt-5 text-center">Create payment</h1>
                <hr />
                {CreatePaymentForm()}
            </div>
        </Layout>
    );
};

export default CreateSponsorPayment;
