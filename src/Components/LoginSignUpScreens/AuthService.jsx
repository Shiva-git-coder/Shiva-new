import React from "react";
import Cookies from "js-cookie";

const getCurrentUSer = async () => {
    const userDetails = await Cookies.get("userInfo");
    return userDetails ? JSON.parse(userDetails) : null; 
}


const AuthService = {
    getCurrentUSer,
}


export default AuthService;