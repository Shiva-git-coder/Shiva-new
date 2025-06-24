import React, { useEffect, useState } from "react";
import signinimg from "../../assets/signinimg.jpg";
// import signinimg from "../../assets/signinimg.jpg";
import DoctorPatientImg from '../../assets/DoctorPatientImg.jpg'
import axios from "axios";
import "./HospitalDashboard.css";
import { resources } from "../Resourses/Resourses";
import { format } from "date-fns";
import HistoryIcon from "@mui/icons-material/History";
// import { useNavigate } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AuthService from "../LoginSignUpScreens/AuthService";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Card, CardContent, Typography, Pagination } from "@mui/material";


const HospitalDashboard = () => {
  const [currentPatient, setCurrentPatient] = useState([]);
  const [patientCount, setPatientCount] = useState({});
  const [doctorDetails, setDoctorDetails] = useState({});
  const [currentPatients, setCurrentPatients] = useState([]);
  const [pastPatients, setPastPatients] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5; // Number of cards per page

  // Calculate the data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patientHistory.slice(indexOfFirstItem, indexOfLastItem);


  const location = useLocation();

  const currentDate = new Date();
  const formatDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await Cookies.remove("userInfo");
    // message.info("You have been logout");
    // console.log("logout")
    navigate("/Login");
    window.location.reload();
  };


  const today = new Date();
  const formattedDate = format(today, "2024-11-13 17:41:58.679257");
  // const docId = "1";

 

  const handleNavigate = () => {
    navigate("/conversation");
  };



  // const handlePatientQueue = async (doctoruhid, date) => {
  //   try {
  //     const patientQueueResponse = await axios.get(
  //       `${resources.APPLICATION_URL}getspecific?date=${date}&doctorId=${doctoruhid}`
  //     );
  //     if (patientQueueResponse.status === 200) {
  //       setCurrentPatient(patientQueueResponse.data);
  //     }
  //   } catch (error) {
  //     console.log("error ====>", error);
  //   }
  // };

  const getTotalPatientsCount = async (doctorId) => {
    try {
      const res = await axios.get(`${resources.APPLICATION_URL}totalPatientCountByDoctor?doctorId=${doctorId}`)
      console.log("patientsCount===>", res.data.overallCount
      );
      setPatientCount(res.data);
    }
    catch (e) {
      console.log("error", e)
    }
  }

  const getCurrentPatientDetails = async (id) => {
    try {
      const res = await axios.get(`${resources.APPLICATION_URL}completedPatientsDetails?doctorId=${id || doctorDetails?.doctorId}&currentDate=${formatDate}`)
      setCurrentPatients(res.data)
      // console.log("resGetCurrent===>",res.data);
    }
    catch (e) {
      console.log("error", e)
    }
  }

  const getPatientHistoryDetails = async (id) => {
    try {
      const res = await axios.get(`${resources.APPLICATION_URL}completedPatientsHistory?doctorId=${id || doctorDetails?.doctorId}&currentDate=${formatDate}`)
      setPastPatients(res.data);
      console.log("resHistory===>", res)
    }
    catch (e) {
      console.log("error", e)
    }
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await AuthService.getCurrentUSer();
      setDoctorDetails(user);
      // setDoctorId(user?.doctorId);
      getTotalPatientsCount(user?.doctorId);
      getCurrentPatientDetails(user?.doctorId);
      getPatientHistoryDetails(user?.doctorId);
      console.log("gettingUserDeatils===>", user);
    };

    fetchUserRole();
  }, []);


  const viewPatientHistory = async (uhid) => {
    // setShowPopup(true);
    try {
      const viewpresponse = await axios.get(
        `${resources.APPLICATION_URL}conversation/doctor/patient/alldetails?uhid=${uhid}`
      );

      if (viewpresponse.status === 200) {
        setPatientHistory(viewpresponse.data || []);
      }
    } catch (error) {
      console.log("error ==>", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleHistory = (patient) => {
    viewPatientHistory(patient.uhid);
    console.log("history===>", patient)
    handleOpen();
  };




  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="dashboard-title">Hospital Management</h1>
        <div onClick={handleLogout} style={{ cursor: "pointer" }}><ExitToAppIcon sx={{ marginTop: "10px" }} /><p>Logout</p></div>
      </div>
      <div className="dashboard-main-container">
        <div className="main-subContainer">
          <div className="hello-card">
            <div>
              <h1 className="hello-card-title">Hello Doctor</h1>
              <p className="hello-card-description">
                You have more updates, etc.
              </p>
              <p className="hello-card-link">
                Read more
              </p>
            </div>
            <div>
              <h1 className="hello-card-received-title">
                Received Scans from Anderson Center
              </h1>
            </div>
          </div>
          <div className="care-card">
            <div>
              <h1 className="care-card-title" style={{ marginBottom: "10px" }}>
                We care about our patients' follow-up
              </h1>
              <p className="care-card-description">
                We ensure our patients receive the best care and attention.
              </p>
            </div>
            <div className="care-card-image-container">
              <img
                src={DoctorPatientImg} // Replace with your image URL
                alt="Care follow-up"
                className="care-card-image"
              />
            </div>
          </div>

          {/* <div className="care-card">
            <div className="care-card-text">
              <h1 className="care-card-title">
                We care about our patients' follow-up
              </h1>
              <p className="care-card-description">
                We ensure our patients receive the best care and attention.
              </p>
            </div>
            <div className="care-card-image-container">
              <img
                src={DoctorPatientImg} // Replace with your image URL
                alt="Care follow-up"
                className="care-card-image"
              />
            </div>
          </div> */}

        </div>
      </div>

      <div className="cards-container">
        <div className="card">
          <h3 className="card-title blue">Today's Appointment</h3>
          <p className="card-description" onClick={handleNavigate}>
            View Details
          </p>
        </div>

        {/* <div className="card">
          <h3 className="card-title green">Total Patients</h3>
          <p className="card-description">20</p>
        </div>

        <div className="card">
          <h3 className="card-title yellow">Active</h3>
          <p className="card-description">30</p>
        </div> */}

        <div className="card">
          <h3 className="card-title green">Total Clients</h3>
          <div className="circular-chart green">
            <span className="count">{patientCount.overallCount}</span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title yellow">Active</h3>
          <div className="circular-chart yellow">
            <span className="count">{patientCount.activeCount}</span>
          </div>
        </div>

      </div>

      <div className="report-container">
        <div className="report-card" style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <h1 className="report-card-title">Today's Completed Patients List</h1>
            <div style={{ overflowY: "auto" }}>
              {currentPatients?.length > 0 ? (
                <div className="patient-list-container">
                  {currentPatients?.map((patient) => (
                    <button
                      key={patient.id}
                      className="patient-card"
                    >
                      <div className="patient-main-card">
                        <h5 className="patient-name">
                          {patient.patientName.charAt(0).toUpperCase() + patient.patientName.slice(1)}
                        </h5>
                        <p className="patient-dob">DOB: {patient.dob}</p>
                      </div>
                      <div className="patient-footer">
                        <p className="history-btn">Feedback Summary</p>
                        <div>
                          <button
                            onClick={() => handleHistory(patient)}
                            // disabled={!patient.history}
                            className="history-btn"
                          >
                            <HistoryIcon sx={{ fontSize: "18px", color: "black" }} />
                            <span className="history-text">History</span>
                          </button>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-patients">No patients in the queue.</p>
              )}
            </div>
          </div>

          <div>
            <h1 className="report-card-title">Daily Report</h1>
            <div style={{ overflowY: "auto" }}>
              {pastPatients?.length > 0 ? (
                <div className="patient-list-container">
                  {pastPatients?.map((patient) => (
                    <button
                      key={patient.id}
                      className="patient-card"
                    >
                      <div className="patient-main-card">
                        <h5 className="patient-name">
                          {patient.patientName.charAt(0).toUpperCase() + patient.patientName.slice(1)}
                        </h5>
                        <p className="patient-dob">DOB: {patient.dob}</p>
                      </div>
                      <div className="patient-footer">
                        <p className="history-btn">Feedback Summary</p>
                        <div>
                          <button
                            onClick={() => handleHistory(patient)}
                            // disabled={!patient.history}
                            className="history-btn"
                          >
                            <HistoryIcon sx={{ fontSize: "18px", color: "black" }} />
                            <span className="history-text">History</span>
                          </button>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-patients">No patients in the queue.</p>
              )}
            </div>
          </div>
            <Dialog
              open={open}
              onClose={handleClose}
              fullWidth
              maxWidth="sm"
              style={{ padding: 0 }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleClose}
                  style={{ padding: "8px", color: "#888" }}
                >
                  <CloseIcon />
                </Button>
              </div>
              <DialogContent>
                <div>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    {patientHistory[currentPage - 1] && ( // Display one item per page
                      <>
                        <h6 className="date_heading">
                          Date:{" "}
                          {patientHistory[currentPage - 1]?.conversationDate.split(
                            "T"
                          )[0] || "N/A"}
                        </h6>
                        <Card style={{ width: "100%", margin: "10px" }}>
                          <CardContent>
                            <p className="modal-para">
                              <span className="modal-span">Case Identification Information: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.case_identification_information || "Not Specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">
                              Conversation Overview :{" "}
                              </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.conversation_overview || "None"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Client's Objectives: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.clients_objectives || "No history"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Facts of the Case: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.facts_of_the_case || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">
                              Legal Issues Identified:{" "}
                              </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.legal_issues_identified || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Relevant Legal Precedents or Laws: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.relevant_legal_precedents_or_laws || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Evidence Mentioned: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.evidence_mentioned || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Legal Advice Given: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.legal_advice_given || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Next Steps/Action Plan : </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.next_steps_action_plan || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Client’s Questions or Concerns: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.clients_questions_or_concerns || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Financial Considerations: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.financial_considerations || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span">Risks and Challenge: </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.risks_and_challenges || "Not specified"}
                            </p>
                            <p className="modal-para">
                              <span className="modal-span"> Follow-Up Actions : </span>
                              {patientHistory[currentPage - 1]?.convodetails
                                ?.follow_up_actions || "Not specified"}
                            </p>
                            <p className="modal-para">
                             <span className="modal-span">Final Notes and Observations  : </span>
                            {patientHistory[currentPage - 1]?.convodetails
                              ?.final_notes_and_observations || "Not specified"}
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </Box>

                  {/* Pagination */}
                  <Box display="flex" justifyContent="center" marginTop={2}>
                    <Pagination
                      count={patientHistory.length} // Each page represents one object
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)} // Handle page change
                      color="primary"
                    />
                  </Box>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;
