import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginImg from "../../assets/LoginPage.jpg";
import Cookies from "js-cookie";
import axios from "axios";
import "../LoginSignUpScreens/Login.css"
import { message } from "antd";
import { resources } from "../Resourses/Resourses";
import RoleCreations from "../AdminScreens/RoleCreations";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [Role, setRole] = useState("Lawyer");
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!navigator.onLine) {
      setError("Please check your internet connection.");
      return;
    }

    try {
      const userCredential = { username, password };
      const response = await axios.post(
        `${resources.Authorization_URL}signin`,
        userCredential
      );

      if (response) {
        Cookies.set("userInfo", JSON.stringify(response.data), { expires: 7 });
        setUsername("");
        setPassword("");
        console.log("User role:", response.data.roles[0]);

        let dashboard = "";

        // Normalize the role for comparison
        const role = response.data.roles[0]?.trim().toUpperCase();
        console.log("rolesLogin--->", role);

        switch (role) {
          case "ROLE_DOCTOR":
            dashboard = "/sidebar";
            break;
          case "ROLE_ADMIN":
            dashboard = "/RoleCreations";
            break;
          // case "ROLE_RECEPTIONIST":
          //   dashboard = "/opd-screen";
          //   break;
          default:
            dashboard = "/";
        }

        navigate(dashboard);
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Bad credentials. Please check your username and password.");
        } else {
          setError(
            `Error: ${error.response.status} - ${
              error.response.data.message || error.message
            }`
          );
        }
      } else if (error.request) {
        setError(
          "No response from the server. Please check your internet connection."
        );
      } else {
        setError(`Error: ${error.message}`);
      }
      console.log("Error details:", error);
    }
  };

  return (
    <>
      {/* <NavigationCom /> */}
     
      <div className="Login_container">
      
        <div className="Login_image">
          {/* <img src={Roll !="Lawyer"?loginImg: " " } alt="Sample" /> */}
          <div>
          <img  className="SVGCLS" src = "/src/assets/LawyerIMG.jpg" alt="laywer" />
          </div>
        </div>
        <div className="Login_form_container">
          <h2 className="Login_heading">Sign In</h2>
          <form onSubmit={handleSubmit} className="Login_form">
            {error && <div className="error">{error}</div>}
            {/* <label className="RoleIMG">
              <input
                type="radio"
                name="userType"
                value="Lawyer"
                checked={Role === "Lawyer"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Lawyer
            </label>
            <label className = "RoleIMG">
              <input
                type="radio"
                name="userType"
                value="Client"
                checked={Role === "Client"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Receptionist
            </label> */}
            <input
              required
              className="Login_input"
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              required
              className="Login_input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <motion.button className="Login_input login-button" 
              animate={{ scale: isClicked ? 1.1 : 1 }}
              transition={{ duration: 0.2  }}
            onClick={() => setIsClicked(!isClicked)} type="submit">
              Sign In
            </motion.button>
          </form>
          <br />
          <div className="signup-link" style={{ textAlign: "end" }}>
            <Link to="/registration">Reset Password Here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
