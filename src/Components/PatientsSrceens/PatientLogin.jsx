// src/LoginForm.js

import axios from 'axios';
import React, { useState } from 'react';
import { resources } from '../Resourses/Resourses';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import loginImg from '../../assets/LoginPage.jpg'

const PatientLogin = () => {

    const successMessage = (message) => {
        toast.success(message, { position: "top-center" });
    };

    const errorMessages = (message) => {
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

    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [type, setType] = useState('mobile');
    const [uhid, setuhid] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        // if (!password && !username) {
        //     setErrorMessage("Both UHID and Phone Number are empty.");
        //     return;
        // }

        // if (!username) {
        //     setErrorMessage("Date of Birth is empty.");
        //     return;
        // }

        // const output = {
        //     UHID: '',
        //     PhoneNumber: '',
        //     username: username,
        // };

        // if (password) {
        //     if (isNaN(password)) {
        //         output.UHID = password;
        //         console.log("Output:", output);
        //     } else {
        //         output.PhoneNumber = password;
        //         console.log("Output:", output);
        //     }
        // } else {
        //     console.log("Output:", output);
        // }
        // console.log(`password: ${password}, Date of Birth: ${username}`);

        if (type === 'mobile') {
            const data = { username: formatDateToDDMMYYYY(username), password: password }
            axios.post(`${resources.Authorization_URL}signin`, data).then(response => {
                Cookies.set("userInfo", JSON.stringify(response.data), { expires: 7 });
                navigate('/patient-screens');
                // return successMessage(response.data.message)

                // if (response.data.staus === "false") {
                //     errorMessages(response.data.message)
                // }

            }).catch(error => {
                console.log(error);
                if (error.response.data.staus === "false") {
                    return errorMessages(error.response.data.message)
                }

                errorMessages("Login Failed Try Again!")

            })
        }



    };


    const handleChange = (e) => {
        setType(e.target.value)
    }

    return (
        <div className="Login_container">
            <div className="Login_image">
                <img src={loginImg} alt="Sample" />
            </div>
            <div className="Login_form_container">
                <h2 className="Login_heading">Sign In</h2>
                <form onSubmit={handleSubmit} className="Login_form">
                    <div className="radio-group" style={{ textAlign: 'center' }}>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="mobile"
                                checked={type === 'mobile'}
                                onChange={handleChange}
                            /> &emsp;
                            Mobile
                        </label>
                        &emsp;
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="uhid"
                                onChange={handleChange}
                            /> &emsp;
                            UHID
                        </label>
                    </div>

                    {type === 'mobile' && (
                        <div>
                            {/* <label htmlFor="password" className="Login_label">Mobile Number:</label> */}
                            <input
                                type="text"
                                id="password"
                                placeholder='Mobile'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="Login_input"
                            />

                            {/* <label htmlFor="username" className="Login_label">Date of Birth:</label> */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="Login_input"
                                />
                                {!username && (
                                    <span className="placeholder"> Date Of Birth</span>
                                )}

                                {errorMessage && <p className="error">{errorMessage}</p>}
                            </div>
                            <div style={{ textAlign: 'center', margin: '10px 0px', }}>
                                <button style={{ backgroundColor: '#00796B', color: 'white', padding: '8px 10px', border: 'none', borderRadius: '5px' }} type="submit" className="Login_button">Login</button>

                            </div>
                            <p>
                                New user?{' '}
                                <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() => navigate('/appointment-registration')}
                                    className="signup-link"
                                >
                                    Register
                                </span>
                            </p>
                        </div>
                    )}

                    {type === 'uhid' && (
                        <div>
                            {/* <label htmlFor="uhid" className="Login_label">UHID:</label> */}
                            <input
                                type="text"
                                id="uhid"
                                placeholder='UHID'
                                value={uhid}
                                onChange={(e) => setuhid(e.target.value)}
                                required
                                className="Login_input"
                            />
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            <div style={{ textAlign: 'center', margin: '10px 0px', }}>
                                <button style={{ backgroundColor: '#00796B', color: 'white', padding: '8px 10px', border: 'none', borderRadius: '5px' }}  type="submit" className="Login_button">Login</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );

   
};




export default PatientLogin;