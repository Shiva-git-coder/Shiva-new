import React, { useState } from "react";
import './PatientAppointment.css';
import axios from "axios";
import { resources } from "../Resourses/Resourses";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import loginImg from '../../assets/LoginPage.jpg'


const AppointmentRegistration = () => {
    const successMessage = (message) => {
        toast.success(message, { position: "top-center" });
    };

    const errorMessage = (message) => {
        toast.error(message, { position: "top-center" });
    };

    const formatDateToDDMMYYYY = (dateString) => {
        console.log("datestring =======>", dateString)
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: "",
        email: "",
        mobile: "",
        dateOfBirth: "",
        otp: ''
    });

    const [errors, setErrors] = useState({});

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSendOtp = () => {
        if (!formData.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required to send OTP." }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
            axios.post(`${resources.Authorization_URL}sendOtpToEmailAuthetication`, {}, {
                params: { email: formData.email }
            }).then(response => {
                console.log(response);
                successMessage(response.data);
                setOtpSent(true);
            }).catch(error => {
                errorMessage("Failed to Send Otp");
            });
        }
    };

    const handleVerifyOtp = () => {
        axios.post(`${resources.Authorization_URL}verifyEmailForAuthentication`, {}, {
            params: {
                email: formData.email,
                otp: formData.otp
            }
        }).then(response => {
            console.log(response);
            setOtpVerified(true);
            successMessage(response.data)
        }).catch(error => {
            console.log(error);
            setErrors((prevErrors) => ({ ...prevErrors, otp: "Invalid OTP." }));
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();



        const sendingData = { patientName: formData.patientName, username: formatDateToDDMMYYYY(formData.dateOfBirth), mobile: formData.mobile, dob: formatDateToDDMMYYYY(formData.dateOfBirth), email: formData.email, role: ['ROLE_PATIENT'], password: formData.mobile }
        axios.post(`${resources.Authorization_URL}signup`, sendingData).then(response => {
            console.log(response);
            successMessage("Successfully Registered");
            navigate('/patient-login')
        }).catch(error => {
            if (error.response.data.message) {
                return errorMessage(error.response.data.message);
            }
            errorMessage("Failed to Register. Try Again!")
        })
        const validationErrors = {};

        Object.keys(formData).forEach((field) => {
            if (!formData[field] && field !== "otp") {
                validationErrors[field] = "This field is required.";
            }
        });

        if (!otpVerified) { 
            validationErrors.otp = "OTP must be verified before submitting.";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const sendingData = {patientName:formData.patientName,mobile:formData.mobile,dateOfBirth:formData.dateOfBirth,email:formData.email,role:['ROLE_PATIENT']}
           axios.post(`${resources.Authorization_URL}signup`,sendingData).then(response => {
            console.log(response);
            successMessage("Successfully Registered")
           }).catch(error => {
            errorMessage("Failed to Register. Try Again!")
           })
        }
    };

    return (
        <div className="Login_container">
            
            <div className="Login_image">
                <img src={loginImg} alt="Registration" />
            </div>
            <div className="Login_form_container">
            <h2 className="Login_heading">Sign In</h2>
                {/* <h2 className="Login_heading">Patient Registration</h2> */}
                <form onSubmit={handleSubmit} className="Login_form">
                    <div className="form-group">
                        {/* <label className="Login_label">Patient Name</label> */}
                        <input
                            type="text"
                            name="patientName"
                            placeholder="Patient Name"
                            value={formData.patientName}
                            onChange={handleInputChange}
                            className="Login_input"
                        />
                        {errors.patientName && <span className="error">{errors.patientName}</span>}
                    </div>

                    <div className="form-group">
                        {/* <label className="Login_label">Phone/Mobile</label> */}
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            placeholder="Mobile"
                            onChange={handleInputChange}
                            className="Login_input"
                            maxLength={10} 
                            pattern="\d{10}"
                        />
                        {errors.mobile && <span className="error">{errors.mobile}</span>}
                    </div>

                    <div className="form-group" style={{position:'relative'}}>
                        {/* <label className="Login_label">Date of Birth</label> */}
                        <input
                            type="date"
                            name="dateOfBirth"
                            placeholder="Date Of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="Login_input"
                        />
                        {!formData.dateOfBirth && (
                            <span className="placeholder">Select your date of birth</span>
                        )}  
                        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '3px' }}>
                        {/* <label className="Login_label">Email</label> */}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="Login_input"
                            style={{ width: '80%' }}
                        />


                        <button type="button" style={{ height: '30px', border: 'none', padding: '3px 2px', marginTop: '20px', backgroundColor: '#00796B', color: 'white', borderRadius: '5px', cursor: 'pointer' }} className="Login_button" onClick={handleSendOtp}>
                            Send OTP
                        </button>

                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}


                    {otpSent && (
                        <div className="form-group" style={{ display: 'flex', gap: '3px' }}>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                className="Login_input"
                                placeholder="Enter OTP"
                                style={{ width: '80%' }}
                            />

                            <button type="button" className="Login_button" style={{ height: '30px', border: 'none', padding: '3px 2px', marginTop: '20px', backgroundColor: '#00796B', color: 'white', borderRadius: '5px', cursor: 'pointer' }} onClick={handleVerifyOtp}>
                                Verify OTP
                            </button>
                        </div>
                    )}
                    {errors.otp && <span className="error">{errors.otp}</span>}

                    <div className="form-group" style={{ textAlign: 'center', margin: '5px 0px' }}>
                        <button type="submit" style={{ backgroundColor: '#00796B', color: 'white', padding: '5px 7px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} className="Login_button">Submit</button>
                    </div>

                    <p style={{ marginTop: '5px' }}>
                        Already have an Account?{' '}
                        <span style={{ color: 'blue' ,cursor:'pointer'}} className="signup-link" onClick={() => navigate('/patient-login')}>
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );

};

export default AppointmentRegistration;
