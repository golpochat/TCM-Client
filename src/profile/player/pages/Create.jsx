import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Layout from "../../../layout/common/Layout";
import { isAuth, getCookie } from "../../../auth/AuthHelper";
import './Profile.css'

const CreateProfile = ({ history }) => {
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    address: '',
    contact_number: '',
    level: '',
    image: '',
    btnLabel: "Create profile",
  });
  const [joining_year, setJoiningYear] = useState(new Date());
  const [file, setFile] = useState('');
  const token = getCookie("token");
  const {
    first_name,
    last_name,
    address,
    contact_number,
    level,
    image,
    btnLabel
  } = values;
  const handleChange = (name) => (event) => {
    if (name === 'image') {
      setFile(event.target.files[0])
    }
    setValues({ ...values, [name]: event.target.value });
  };
  const doSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData()
    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    formData.append('address', address)
    formData.append('contact_number', contact_number)
    formData.append('level', level)
    formData.append('joining_year', joining_year)
    formData.append('image', image)
    formData.append('image', file)

    // console.log(formData)

    setValues({ ...values, btnLabel: "Creating" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/${isAuth().role}/profile/create`,
      headers: { Authorization: `Bearer ${token}` },
      data: formData
    })
      .then((response) => {
        // console.log("PLAYER PROFILE CREATE SUCCESSFULL", response);
        toast.success(response.data.message);
        history.push(`/${isAuth().role}/profile`);
      })
      .catch((error) => {
        // console.log("PLAYER PROFILE CREATE ERROR", error.response.data.error);
        setValues({ ...values, btnLabel: "Create" });
        // toast.error('Error in creating profile, try again.');
        toast.error(error.response.data.error);
      });
  };

  const profileForm = () => (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6 m-auto">
        <form>
          <div className="form-group">
            <label className="text-muted">First name</label>
            <input
              onChange={handleChange("first_name")}
              type="text"
              className="form-control"
              placeholder="First name"
              value={first_name}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Last name</label>
            <input
              onChange={handleChange("last_name")}
              type="text"
              className="form-control"
              placeholder="Last name"
              value={last_name}
            />
          </div>
          <div className="form-group">
            <p className="text-muted">Profile Picture</p>
            <input
              onChange={handleChange("image")}
              type="file"
              accept="image/jpg, image/jpeg"
            />
            <p className='text-danger'><small>jpg and jpeg image only</small></p>
          </div>
          <div className="form-group">
            <label className="text-muted">Address</label>
            <input
              onChange={handleChange("address")}
              type="address"
              className="form-control"
              placeholder="Address"
              defaultValue={address}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Contact number</label>
            <input
              onChange={handleChange("contact_number")}
              type="text"
              className="form-control"
              placeholder="Contact number"
              defaultValue={contact_number}
            />
          </div>
          <div className="form-group">
            <div className="text-muted">Joining year</div>
            <DatePicker
              className="form-control"
              placeholderText="Click to select a year"
              selected={joining_year}
              onChange={year => setJoiningYear(year)}
              maxDate={new Date()}
              showYearPicker
              dateFormat="yyyy"
              isClearable={true}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Level of professionalism</label>
            <select className="form-control" name="type" value={level} onChange={handleChange("level")}>
              <option key="select" value="">Select one</option>
              <option key="1" value="Amateur">Amateur</option>
              <option key="2" value="Beginner">Beginner</option>
              <option key="3" value="Professional">Professional</option>
            </select>
          </div>

          <Link to="#" className="btn btn-primary btn-md" onClick={doSubmit} >
            {btnLabel}
          </Link>
        </form>
      </div>
    </div>
  );
  return (
    <Layout>
      <div className="container-create-profile">
        <h1 className="text-center">Create Player Profile</h1>
        <hr />
        {profileForm()}
      </div>
    </Layout>
  );
};

export default CreateProfile;
