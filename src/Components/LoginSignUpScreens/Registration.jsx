import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Reuse.css';
// import Signimg from "../../public/signinimg.jpg";
import { resources } from "../Resourses/Resourses";
import signinimg from "../../assets/signinimg.jpg";
import axios from "axios";
// import "../Navigation.css"
// import './Reuse.css'


function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  const validateField = (name, value) => {
    if (
      (name === "password" || name === "confirmPassword") &&
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    ) {
      return {
        isValid: false,
        message:
          "Password must have at least one letter, one number, one special character, and be at least 8 characters long.",
      };
    }
    if (
      name === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      return { isValid: false, message: "Please Enter Correct Email" };
    }
    return { isValid: true };
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedEditData = { ...userLogin };
    const validationResult = validateField(name, value);
    if (value == "") {
      updatedEditData[name + "Error"] = "";
      updatedEditData[name] = "";
      setUserLogin(updatedEditData);
      return;
    }
    if (!validationResult.isValid) {
      updatedEditData[name] = value;
      updatedEditData[name + "Error"] = validationResult.message;
      console.log("updatedEditData", updatedEditData);
      //   message.error(validationResult.message);
      setUserLogin(updatedEditData);
      return;
    }
    updatedEditData[name] = value;
    updatedEditData[name + "Error"] = "";
    setUserLogin(updatedEditData);
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `${resources.Authorization_URL}checkingEmailStatus?email=${userLogin.email}`
    );
    if (res?.data?.status?.toLowerCase() == "true") {
      setVerifyStatus(true);
      message.success(res.data.message);
    } else {
      message.error(res.data.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userLogin.password === userLogin.confirmPassword) {
      setError("");
      const userCredential = {
        username: userLogin.email,
        password: userLogin.confirmPassword,
      };
      const res = await axios.put(
        `${resources.Authorization_URL}setPassword`,
        userCredential
      );
      console.log("handleSubmit==?", res);
      if (res?.data?.status?.toLowerCase() == "true") {
        setShowPassword(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } else {
      setError("Passwords do not match");
    }
  };
  return (
    <>
      <div className="Login_container">
        <div className="Login_image">
          <img src={signinimg} alt="Sample" />
        </div>
        <div className="Login_form_container">
          <h2 className="Login_heading">Password Creation</h2>
          {!showPassword ? (
            <div className="Login_form">
              {error && <div className="error">{error}</div>}
              <input
                required
                disabled={verifyStatus}
                className="Login_input"
                type="text"
                placeholder="Email"
                name="email"
                value={userLogin.email}
                onChange={(e) => handleChange(e)}
              />
              {userLogin.emailError != "" ? (
                <div className="error noticeInfo">{userLogin.emailError}</div>
              ) : (
                ""
              )}
              {!verifyStatus ? (
                <button
                  disabled={userLogin?.email ? false : true}
                  className={`Login_input login-button`}
                  type="button"
                  onClick={(e) => handleVerify(e)}
                >
                  Verify
                </button>
              ) : (
                <>
                  <input
                    required
                    disabled={showPassword}
                    className="Login_input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={userLogin.password}
                    onChange={(e) => handleChange(e)}
                  />
                  {userLogin.passwordError != "" ? (
                    <div className="error noticeInfo">
                      {userLogin.passwordError}
                    </div>
                  ) : (
                    ""
                  )}
                  <input
                    required
                    disabled={showPassword}
                    className="Login_input"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={userLogin.confirmPassword}
                    onChange={(e) => handleChange(e)}
                  />
                  {userLogin.confirmPasswordError != "" ? (
                    <div className="error noticeInfo">
                      {userLogin.confirmPasswordError}
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    disabled={
                      showPassword ||
                      userLogin.email === "" ||
                      userLogin.password === "" ||
                      userLogin.confirmPassword === "" ||
                      userLogin.emailError !== "" ||
                      userLogin.passwordError !== "" ||
                      userLogin.confirmPasswordError !== ""
                    }
                    className={`Login_input login-button ${
                      showPassword ||
                      userLogin.email === "" ||
                      userLogin.password === "" ||
                      userLogin.confirmPassword === "" ||
                      userLogin.emailError !== "" ||
                      userLogin.passwordError !== "" ||
                      userLogin.confirmPasswordError !== ""
                        ? "disabled"
                        : ""
                    }`}
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Generate User Credential
                  </button>
                </>
              )}
            </div>
          ) : (
            ""
          )}
          {showPassword ? (
            <div
              className="signup-link"
              style={{ textAlign: "end", marginTop: "10px" , textAlign: "center"}}
            >
              Go to <Link to="/Login">Login</Link>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
export default Registration;