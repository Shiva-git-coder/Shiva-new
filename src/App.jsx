import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HospitalDashboard from './Components/HospitalAiSribe/HospitalDashboard';
import Conversation from './Components/Conversation/Conversation';
import RoleCreation from './Components/AdminScreens/RoleCreation';
import Registration from './Components/LoginSignUpScreens/Registration';
import HomePage from './Components/LandingPage/HomePage';
import Login from './Components/LoginSignUpScreens/Login';
import PatientRegistrationForm from './Components/PatientopdScreens/Patient';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from './Components/ReusableComponent/OPDNavBar';
import Sidebar from './Components/ReusableComponent/Sidebar';
import BookAppointment from './Components/PatientsSrceens/BookAppointment';
import AppointmentRegistration from './Components/PatientsSrceens/AppointmentRegistration';
import PatientLogin from './Components/PatientsSrceens/PatientLogin';
import AllPatientDashboard from './Components/PatientsSrceens/AllPatientDashboard';
import RoleCreations from './Components/AdminScreens/RoleCreations';
import AuthService from './Components/LoginSignUpScreens/AuthService';
import { resources } from './Components/Resourses/Resourses';
import ProtectedRoute from './Components/LoginSignUpScreens/ProtectedRoute';


function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
         
        
          <Route path="/" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          {/* <Route path='/appointment-registration' element={<AppointmentRegistration />} /> */}
          {/* <Route path='/patient-login' element={<PatientLogin />} /> */}
          
          <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
            <Route path="/sidebar" element={<Sidebar />} />
            <Route path="/RoleCreations" element={<RoleCreations />} />
          </Route>
          {/* <Route element={<ProtectedRoute allowedRoles={['ROLE_RECEPTIONIST']} />}>
            <Route path="/opd-screen" element={<NavBar />} />
          </Route> */}
           {/* <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/RoleCreations" element={<RoleCreations />} />
          </Route>  */}
          {/* <Route element={<ProtectedRoute allowedRoles={['ROLE_END_USER']} />}>
            <Route path="/patient-screens" element={<AllPatientDashboard />} />
          </Route>  */}
        </Routes>
      </Router>
    </>
  )
}

export default App;