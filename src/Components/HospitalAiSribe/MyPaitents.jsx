import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Pagination,
} from "@mui/material";
import {
  History as HistoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AuthService from "../LoginSignUpScreens/AuthService";
import axios from "axios";
import { resources } from "../Resourses/Resourses";
import { parse, isWithinInterval } from "date-fns";
import FeedbackIcon from "@mui/icons-material/Feedback";
// import cardBg from "../../assets/medicalBg.avif";
import cardBg2 from "../../assets/medicalBg2.avif";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
const parseDate = (dateString) => {
  return parse(dateString, "dd-MM-yyyy", new Date());
};

const convertToDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const MyPatients = () => {
  const [currentPatient, setCurrentPatient] = useState([]);
  const [patientCount, setPatientCount] = useState({});
  const [doctorDetails, setDoctorDetails] = useState({});
  const [currentPatients, setCurrentPatients] = useState([]);
  const [pastPatients, setPastPatients] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [TodayPatients, setTodayPatients] = useState([]);
  const [todaySearch, setTodaySearch] = useState("");

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patientHistory.slice(indexOfFirstItem, indexOfLastItem);

  const location = useLocation();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const groupPatientsByDate = (patients) => {
    if (!Array.isArray(patients) || patients.length === 0) {
      return {};
    }
    return patients.reduce((acc, patient) => {
      const date = parse(patient?.assignDate, "dd-MM-yyyy", new Date());
      const dateString = format(date, "dd-MM-yyyy");
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(patient);
      return acc;
    }, {});
  };

  const filterPatients = () => {
    let result = [...pastPatients];

    if (searchName) {
      result = result.filter((patient) =>
        patient.patientName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      result = result.filter((patient) => {
        const patientDate = convertToDate(patient.assignDate);
        console.log(start, end, patientDate);
        return patientDate >= start && patientDate <= end;
      });
    }

    setFilteredPatients(result);
  };

  const filterPatientsToday = () => {
    let result = [...currentPatients];

    if (todaySearch) {
      result = result.filter((patient) =>
        patient.patientName.toLowerCase().includes(todaySearch.toLowerCase())
      );
    }

    setTodayPatients(result);
  };

  useEffect(() => {
    filterPatientsToday();
  }, [todaySearch]);

  const currentDate = new Date();
  const formatDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getFullYear()}`;

  const handleLogout = async () => {
    await Cookies.remove("userInfo");
    navigate("/");
    window.location.reload();
  };

  const today = new Date();
  const formattedDate = format(today, "2024-11-13 17:41:58.679257");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/conversation");
  };

  const getTotalPatientsCount = async (doctorId) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}totalPatientCountByDoctor?doctorId=${doctorId}`
      );
      console.log("patientsCount===>", res.data.overallCount);
      setPatientCount(res.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getCurrentPatientDetails = async (id) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}completedPatientsDetails?doctorId=${
          id || doctorDetails?.doctorId
        }&currentDate=${formatDate}`
      );
      setCurrentPatients(res.data);
      setTodayPatients(res.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getPatientHistoryDetails = async (id) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}completedPatientsHistory?doctorId=${
          id || doctorDetails?.doctorId
        }&currentDate=${formatDate}`
      );
      if (Array.isArray(res.data)) {
        setPastPatients(res.data);
        setFilteredPatients(res.data);
      }
      console.log("resHistory===>", res);
    } catch (e) {
      console.log("error", e);
      setPastPatients(defaultPatients);
      setFilteredPatients(defaultPatients);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await AuthService.getCurrentUSer();
      setDoctorDetails(user);
      getTotalPatientsCount(user?.doctorId);
      getCurrentPatientDetails(user?.doctorId);
      getPatientHistoryDetails(user?.doctorId);
      console.log("gettingUserDeatils===>", user);
    };

    fetchUserRole();
  }, []);

  const viewPatientHistory = async (uhid) => {
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
    console.log("history===>", patient);
    handleOpen();
  };

  useEffect(() => {
    filterPatients();
  }, [searchName, startDate, endDate]);

  const groupedPatients = groupPatientsByDate(filteredPatients);

  return (
    <Box padding={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              value={todaySearch}
              onChange={(e) => setTodaySearch(e.target.value)}
              sx={{ marginRight: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ color: "blue" }} position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Card sx={{ marginBottom: 2 }}>
            <Typography
              sx={{
                fontWeight: "semibold",
                fontSize: "1.25rem",
                textAlign: "center",
                marginBottom: 2,
                color: "#00796B",
              }}
            >
              Today's Completed Clients List
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                backgroundImage: `url(${cardBg2})`,
                backgroundPosition: "-40px -70px",
              }}
            >
              {currentPatients?.length > 0 ? (
                TodayPatients?.map((patient) => (
                  <Card
                    key={patient.id}
                    sx={{
                      marginBottom: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 2,
                      padding: 2,
                      boxShadow: 6,
                      width: "48%",
                      //   height: "auto",
                      backgroundImage: `url(${cardBg2})`,
                      backgroundPosition: "5px ",
                      "&:hover": {
                        border: "1px solid #00796B",
                        transform: "scale(1.01)",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: "500" }}>
                      {patient.patientName.charAt(0).toUpperCase() +
                        patient.patientName.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      DOB: {patient.dob}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 1,
                      }}
                    >
                      <Button
                        onClick={() => handleHistory(patient)}
                        sx={{ color: "black", background: "#CCD5AE" }}
                        startIcon={<FeedbackIcon />}
                      >
                        Feedback
                      </Button>
                      <Button
                        onClick={() => handleHistory(patient)}
                        sx={{ color: "black", background: "#CDC1FF" }}
                        startIcon={<HistoryIcon />}
                      >
                        History
                      </Button>
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No Clients in the queue.
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ marginRight: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ color: "blue" }} position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              sx={{ marginRight: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Card sx={{ marginBottom: 2 }}>
            <Typography
              sx={{
                fontWeight: "semibold",
                fontSize: "1.25rem",
                textAlign: "center",
                marginBottom: 2,
                color: "#00796B",
              }}
            >
              Daily Report
            </Typography>
            <Box
              sx={{
                fontWeight: "semibold",
                fontSize: "1.25rem",
                textAlign: "center",
                // marginBottom: 2,
                color: "#00796B",
              }}
            >
              {Object.keys(groupedPatients).length > 0 ? (
                Object.keys(groupedPatients).map((date) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      backgroundImage: `url(${cardBg2})`,
                      backgroundPosition: "-40px -70px",
                    }}
                  >
                    {groupedPatients[date].map((patient) => (
                      <Card
                        key={patient.uhid}
                        sx={{
                          backgroundImage: `url(${cardBg2})`,
                          marginBottom: 2,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 2,
                          padding: 2,
                          boxShadow: 6,
                          width: "48%",
                          // height:"auto",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            border: "1px solid #00796B",
                            transform: "scale(1.01)",
                          },
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "1.1rem", fontWeight: "500" }}
                        >
                          {patient.patientName.charAt(0).toUpperCase() +
                            patient.patientName.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          DOB: {patient.dob}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 1,
                          }}
                        >
                          {/* <Typography variant="body2" sx={{ color: "#3f51b5" }}>
                            Feedback
                          </Typography> */}
                          <Button
                            onClick={() => handleHistory(patient)}
                            sx={{ color: "black", background: "#CCD5AE" }}
                            startIcon={<FeedbackIcon />}
                          >
                            Feedback
                          </Button>
                          <Button
                            onClick={() => handleHistory(patient)}
                            sx={{ color: "black", background: "#CDC1FF" }}
                            startIcon={<HistoryIcon />}
                          >
                            History
                          </Button>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No patients found.
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

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
          <Box display="flex" flexDirection="column" justifyContent="center">
            {patientHistory[currentPage - 1] && (
              <>
                <h6 className="date_heading">
                  Date:{" "}
                  {(() => {
                    const conversationDate =
                      patientHistory[currentPage - 1]?.conversationDate.split(
                        "T"
                      )[0];
                    const dateParts = conversationDate?.split("-");
                    if (dateParts) {
                      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    }
                    return "N/A";
                  })()}
                </h6>

              <Card style={{ width: "100%", margin: "10px" }}>
                                <CardContent>
            
                                  <p className="modal-para">
                                    <span className="modal-span">
                                    Case Identification Information: {" "}
                                    </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.case_identification_information || "None"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">
                                    Conversation Overview: {" "}
                                    </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.conversation_overview || "None"}
                                  </p>
            
            
                                  <p className="modal-para">
                                    <span className="modal-span">
                                    Client's Objectives: {" "}
                                    </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.clients_objectives || "None"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">Facts of the Case : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.facts_of_the_case || "No history"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">Legal Issues Identified : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.legal_issues_identified || "Not specified"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">
                                    Relevant Legal Precedents or Laws:{" "}
                                    </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.relevant_legal_precedents_or_laws || "Not specified"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">Evidence Mentioned : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.evidence_mentioned || "Not specified"}
                                  </p>
            
                                  <p className="modal-para">
                                    <span className="modal-span">Legal Advice Given : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.legal_advice_given || "Not specified"}
                                  </p>
                                  <p className="modal-para">
                                    <span className="modal-span">Next Steps/Action Plan : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.next_steps_action_plan || "Not specified"}
                                  </p>
                                  <p className="modal-para">
                                    <span className="modal-span"> Client’s Questions or Concerns : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.clients_questions_or_concerns || "Not specified"}
                                  </p>
                                  <p className="modal-para">
                                    <span className="modal-span"> Financial Considerations : </span>
                                    {patientHistory[currentPage - 1]?.convodetails
                                      ?.financial_considerations || "Not specified"}
                                  </p>
                                  <p className="modal-para">
                                    <span className="modal-span">Risks and Challenges  : </span>
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

            {/* Pagination */}
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Pagination
                count={patientHistory.length} // Each page represents one item
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)} // Handle page change
                color="primary"
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyPatients;
