import AudioRecorderPolyfill from "audio-recorder-polyfill";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { resources } from "../Resourses/Resourses";
import "./Conversation.css";
// import { json } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { Button, Card, CardContent, Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import 'animate.css';
import AuthService from "../LoginSignUpScreens/AuthService";


// Polyfill for MediaRecorder
if (!window.MediaRecorder) {
  window.MediaRecorder = AudioRecorderPolyfill;
}

function Conversation() {
  const date = new Date();
  // const  currentDate = date.toLocaleDateString();
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [patients, setPatients] = useState([]);
  const [patientFilter, setPatientFilter] = useState([])
  const [showForm, setShowForm] = useState(false);


  const [patientData, setPatientData] = useState({
    convodetails: {
      case_identification_information : "", 
      conversation_overview  : "",
      clients_objectives  : "",
      facts_of_the_case   : "", 
      legal_issues_identified   : "", 
      relevant_legal_precedents_or_laws   : "", 
      evidence_mentioned   : "", 
      legal_advice_given   : "", 
      next_steps_action_plan   : "", 
      clients_questions_or_concerns   : "", 
      financial_considerations   : "", 
      risks_and_challenges   : "", 
      follow_up_actions   : "", 
      final_notes_and_observations  : "", 
      conversation: "",
    },
    conversationDate: "",
  });


  const [newClient, setNewClient] = useState({
    uhid: "",
    patientName: "",
    dob: "",
    history:"",
    assignDate: "",
    place:"",
    PhoneNumber:"",
  });
  const [errors, setErrors] = useState({
    uhid: "",
    patientName: "",
    dob: "",
    assignDate: "",
    PhoneNumber: "",
    place: "",
  });


  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [patientObj, setPatientObj] = useState({});
  // const [language, setLangauge] = useState();
  const [searchitem,Setsearchitem] = useState("")



  const [dropdownValues, setDropdownValues] = useState({
    languageCode: "en",
    languageName: "English",
  });

  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [markOpen, setMarkOpen] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0); // Timer state

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activePatient, setActivePatient] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const currentDate = new Date();
  const formatDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5; // Number of cards per page

  // Calculate the data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = patientHistory.slice(indexOfFirstItem, indexOfLastItem);

  const languagesArray = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "ur", name: "Urdu" },
    { code: "kn", name: "Kannada" },
    { code: "pa", name: "Punjabi" },
    { code: "gu", name: "Gujarati" },
    { code: "ml", name: "Malayalam" },
    { code: "or", name: "Odia" },
    { code: "as", name: "Assamese" },
    { code: "ne", name: "Nepali" },
    { code: "si", name: "Sinhala" },
  ];

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const convoHandle = async (path) => {
    setLoading(true);
    try {
      const url = "http://192.168.1.157:8000/";
      // const url = "http://192.168.0.124:5000/";
      const convoresponse = await axios.get(
        `${url}Lawyer_report?language=${dropdownValues.languageCode}&file_name=${path}`
      );  

      console.log("convoresponse==>", JSON.stringify(convoresponse?.data));

      if (convoresponse.status === 200) {
        const LawyerReport = convoresponse.data.lawyer_report[0]; // Assuming clinicalReport is an array with one object

        console.log("LayeerReport==>",LawyerReport);
        const conversationData = convoresponse.data.conversation
          ? convoresponse.data.conversation.split(/\n+/) 
          : [];

        console.log("addData===>", conversationData);
        console.log("conversationData==>", JSON.stringify(conversationData));

        // const summary = clinicalReport?.summary || "";
        // console.log("data-->", JSON.stringify(summary));

        setPatientData({
          case_identification_information: LawyerReport?.case_identification_information || "",
          conversation_overview: LawyerReport?.conversation_overview || "",
          clients_objectives: LawyerReport?.clients_objectives || "",
          facts_of_the_case: LawyerReport?.facts_of_the_case || "",
          hospitalisationHistory: LawyerReport?.hospitalisationHistory || "",
          legal_issues_identified: LawyerReport?.legal_issues_identified || "",
          relevant_legal_precedents_or_laws: LawyerReport?.relevant_legal_precedents_or_laws || "",
          evidence_mentioned: LawyerReport?.evidence_mentioned || "",
          legal_advice_given: LawyerReport?.legal_advice_given || "",
          next_steps_action_plan: LawyerReport?.next_steps_action_plan || "",
          clients_questions_or_concerns: LawyerReport?.clients_questions_or_concerns || "",
          financial_considerations: LawyerReport?.financial_considerations || "",
          risks_and_challenges: LawyerReport?.risks_and_challenges || "",
          follow_up_actions: LawyerReport?.follow_up_actions || "",
          final_notes_and_observations: LawyerReport?.follow_up_actions || "",
          conversation:conversationData,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching conversation data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Ensure loading is stopped regardless of success or failure
    }
  };




  console.log("patientData===>", JSON.stringify(patientData));

  const handleRecording = async () => {
    if (isRecording) {
      stopRecording(); // Stop the recording process
      setIsRecording(false); // Update recording state
      setRecordingTime(0); // Reset the timer
      setPatientData({
      case_identification_information : "", 
      conversation_overview  : "",
      clients_objectives  : "",
      facts_of_the_case   : "", 
      legal_issues_identified   : "", 
      relevant_legal_precedents_or_laws   : "", 
      evidence_mentioned   : "", 
      legal_advice_given   : "", 
      next_steps_action_plan   : "", 
      clients_questions_or_concerns   : "", 
      financial_considerations   : "", 
      risks_and_challenges   : "", 
      follow_up_actions   : "", 
      final_notes_and_observations  : "", 
      conversation :  "",
      });
    } else {
      await startRecording();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRecording]);


  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const audioChunks = [];

      recorder.ondataavailable = (e) => {
        console.log("Data Available:", e.data);
        audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        console.log("Audio Blob:", audioBlob);
        // Create audio URL and set it to state
        const newAudioUrl = URL.createObjectURL(audioBlob);

        uploadAudio(audioBlob);

        setAudioUrl(newAudioUrl);
        // setHasStoppedRecording(true);
        console.log("Audio URL Generated:", newAudioUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log("Recording Started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording Stopped");
    }
  };


  const getPatientDetails = (patient) => {
    return (
      <div className="name-header">
        <p style={{ fontWeight: "bold" }}>
          {patient?.patientName?.toUpperCase()}
        </p>
      </div>
    );
  };

  const handlePatientSelect = (patient) => {
    console.log(selectedPatient);
    console.log("set active patient==>", activePatient);
    getPatientDetails(patient);
    setPatientObj(patient);
    setActivePatient(true);
    console.log("Clicked patient: ", patient);
    setSelectedPatient(patient);
    setPatientId(patient.uhid)
    console.log("data in the handle ====>", patient.uhid);
  };


  const uploadAudio = async (blob) => {
    console.log("selected patient id", selectedPatient.uhid);
    const formData = new FormData();
    console.log("blob===>", blob);

    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd_HH_mm_ss_SSS");

    const audioName = "convertion_" + formattedDate + ".wav";
    formData.append("file", blob, audioName);
    formData.append("uhid", selectedPatient.uhid);

    try {
      const response = await axios.post(
        `${resources.APPLICATION_URL}convoFile`,
        formData
      );
      if (response.status === 200) {
        const path = response.data;
        convoHandle(path);
        console.log("Audio file path: ", path);
        alert("Successfully uploaded audio file");
        setButtonsVisible(true);
      }
    } catch (error) {
      console.log("error", error);
      alert("Error uploading audio file");
    }
  };

  const handleDataSave = async () => {
    const finalData = {
      patientId: patientId || "",
      doctorId: "",
      convodetails: {
        ...patientData
        // allergies: [patientData?.allergies],
        // conversation: patientData.conversation.join("\n\n"),
        // socialHistory: patientData?.socialHistory.map((each) => {
        //   return {
        //     alcoholConsumption: each?.alcoholConsumption,
        //     livingSituation: each?.livingSituation,
        //     Sleep: each?.sleep,
        //     Stress: each?.stress,
        //   };
        // }),
      },
      conversationDate: new Date(),
    };

    console.log("finalData--->", JSON.stringify(finalData));

    try {
      const response = await axios.post(
        `${resources.APPLICATION_URL}storeinfo`,
        finalData
      );

      if (response.status === 200) {
        alert("Data inserted successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.log("error====>", error);
      alert("Error saving data");
    }
  };

  // Handle input change
  const handleInputChange = (e, field) => {
    setPatientData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  /**
   *
   * for viwing history we are getting dates of the patient
   *
   */

  const viewPatientHistory = async (uhid) => {
    setShowPopup(true);
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


  const patientHistoryBydate = async (date) => {
    console.log("date===>", date);
    const filterData = patientHistory?.filter(
      (detail) => detail.conversationDate === date
    );

    console.log("filterData===>", JSON.stringify(filterData));
    setPatientData(filterData.convodetails);
  };
console.log("doctor id =====> ",doctorId)
  const handlePatientQueue = async (id,date) => {
    try {
      const patientQueueResponse = await axios.get(
        `${resources.APPLICATION_URL}getAssignedPatients?doctorId=${id ? id : doctorId}&currentDate=${formatDate}`
      );
      if (patientQueueResponse.status === 200) {
        setPatients(patientQueueResponse.data);
        setPatientFilter(patientQueueResponse.data)
      }
    } catch (error) {
      console.log("error ====>", error);
    }
  };

  // Toggle editing mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const today = new Date();
  const formattedDate = format(today, "2024-11-13 17:41:58.679257");
  const docId = "1";


  const handleHistory = (patient) => {
    console.log("history===>", patient)
    handleOpen();
    viewPatientHistory(patient.uhid);
  };

  const handleChangeValues = (e) => {
    const selectedCode = e.target.value;
    const selectedLanguage = languagesArray.find(
      (lang) => lang.code === selectedCode
    );

    setDropdownValues({
      ...dropdownValues,
      languageCode: selectedCode,
      languageName: selectedLanguage ? selectedLanguage.name : "",
    });
  };

  const fetchUser = async () => {
    const user = await AuthService.getCurrentUSer();
    console.log("user---->", user.doctorId)
    setDoctorId(user.doctorId);
    handlePatientQueue(user.doctorId, formatDate);
  };


  const handleConfirm = async () => {
    try {
      const res = await axios.put(
        `${resources.APPLICATION_URL}updatePatientStatus?patientId=${patientId}`
      );
      handlePatientQueue(doctorId, formatDate);
      setIsDialogOpen(false);
    } catch (e) {
      console.log("error", e);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => { fetchUser() }, [])

  const [selectedSections, setSelectedSections] = useState([]);

  // historyOfIllness
  const sectionTitles = [
    { key: "case_identification_information", title: "Case Identification Information" },  
    { key: "conversation_overview", title: "Conversation Overview" },  
    { key: "clients_objectives", title: "Client's Objectives" },  
    { key: "facts_of_the_case", title: "Facts of the Case" },  
    { key: "legal_issues_identified", title: "Legal Issues Identified" },  
    { key: "relevant_legal_precedents_or_laws", title: "Relevant Legal Precedents or Laws" },  
    { key: "evidence_mentioned", title: "Evidence Mentioned" },  
    { key: "legal_advice_given", title: "Legal Advice Given" },  
    { key: "next_steps_action_plan", title: "Next Steps/Action Plan" },  
    { key: "clients_questions_or_concerns", title: "Client’s Questions or Concerns" },  
    { key: "financial_considerations", title: "Financial Considerations" },  
    { key: "risks_and_challenges", title: "Risks and Challenges" },  
    { key: "follow_up_actions", title: "Follow-Up Actions" },  
    { key: "final_notes_and_observations", title: "Final Notes and Observations" }  
  ];

  const handleCheckboxChange = (key) => {
    setSelectedSections((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((sectionKey) => sectionKey !== key)
        : [...prevSelected, key]
    );
  };

  const handlePrint = () => {
    if (selectedSections.length === 0) {
      alert("No sections selected for printing!");
      return;
    }

    const selectedData = selectedSections.map((key) => ({
      title: sectionTitles.find((section) => section.key === key)?.title,
      value: patientData[key],
    }));

    const printContent = selectedData
      .map(
        ({ title, value }) => `
          <div>
            <h2>${title}</h2>
            <p>${value || "Not specified"}</p>
          </div>
        `
      )
      .join("");

    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Selected Sections</title>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };


  const renderContent = (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      // If the value is an object, format it as a readable string or map it
      return (
        <div>
          {Object.entries(value).map(([subKey, subValue]) => (
            <p key={subKey}>
              <strong>{subKey}:</strong> {subValue}
            </p>
          ))}
        </div>
      );
    } else {
      // Otherwise, just render the value or show "Not specified"
      return <p>{value || "Not specified"}</p>;
    }
  };

  
  const SearchedItem = (event) => {
    const searchValue = event.target.value.toLowerCase();
    Setsearchitem(searchValue);
    if (searchValue === "") {
      setPatientFilter(patients); // Reset to full list when search is cleared
    } else {
      const filteredPatients = patients.filter((patient) =>
        patient.patientName.toLowerCase().includes(searchValue)
      );
      setPatientFilter(filteredPatients);
    }
  };
  const handleAddClient = () => {
    setShowForm(true)
    if (!newClient.patientName.trim()) return;
    setPatients([...patients, newClient]);
    setPatientFilter([...patientFilter, newClient])
    setNewClient({
       uhid: "",
    patientName: "",
    dob: "",
    history:"",
    assignDate: "", });
    console.log(newClient)
    setShowForm(false)
  };
  const [paginationData, setPagination] = useState(1);

  const totalPages = Math.ceil(patientFilter.length / 4);

  const getPaginatedData = () => {
    const startIndex = (paginationData - 1) * 4;
    const endIndex = startIndex + 4;
    return patientFilter.slice(startIndex, endIndex);
  };

  const handleNext = () => {
    if (paginationData < totalPages) {
      setPagination((prev) => prev + 1);
      getPaginatedData()
    }
  };

  const handlePrev = () => {
    if (paginationData > 1) {
      setPagination((prev) => prev - 1);
      getPaginatedData()
    }
  };




  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber); // Check if it's exactly 10 digits
  };

  const validateDateOfBirth = (dob) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/YYYY format
    if (!regex.test(dob)) return false;

    // Parse the date
    const [day, month, year] = dob.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const isValidDate =
      date.getFullYear() == year &&
      date.getMonth() + 1 == month &&
      date.getDate() == day;

    // Check if the date is in the past
    const today = new Date();
    return isValidDate && date < today;
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
    let errorMessage = "";
    if (name === "PhoneNumber") {
      if (!validatePhoneNumber(value)) {
        errorMessage = "Phone number must be exactly 10 digits.";
      }
    } else if (name === "dob") {
      if (!validateDateOfBirth(value)) {
        errorMessage = "Date of birth must be a valid past date.";
      }
    }

    setErrors({ ...errors, [name]: errorMessage });
  };
  console.log(patients)


  return (
    <div className="conversation-container">
      <div className="sidebar">
        <button
          onClick={handleRecording}
          className={`button ${isRecording ? "stop-recording" : "start-recording"
            }`}
          disabled={!activePatient}
        >
          {isRecording ? <StopIcon sx={{ color:"rgb(248, 246, 247)" }} /> : <MicIcon  className="MIC-BTN" sx={{ color:"rgb(254, 251, 252)" }} />}
          <p>{isRecording ? "Stop Recording": "Start Recording"}</p>
        </button>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <label
              style={{
                width: "90px",
                color: " #3358b5",
                fontFamily: "sansSerif",
                marginTop: "8px",
                marginRight: "2px",
                fontWeight: "bold",
              }}
            >
              Language:
            </label>
            <select
              style={{
                width: "200px",
                padding: "10px",
                borderRadius: "5px",
                outline: "none",
              }}
              name="language"
              value={dropdownValues.languageCode}
              onChange={(e) => handleChangeValues(e)}
            >
              {languagesArray.map((language, id) => (
                <option key={id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input className="Text_input"
        type="text"
        placeholder="Search clients..."
        value={searchitem} 
        onChange={SearchedItem}
       /> 

      

        <div style={{ height: "500px", overflowY: "auto" }} className="scrollBar"> 
        {/* <div className="recording-container">
          {showForm && <div className="client-form">
            <input
          className="client-input"
          type="text"
          placeholder="ID Number"
          name="uhid"
          value={newClient.uhid}
          onChange={handleChangeInput}
        />
        {errors.uhid && <span className="error">{errors.uhid}</span>}
      
       <input
          className="client-input"
          type="text"
          placeholder="Name"
          name="patientName"
          value={newClient.patientName}
          onChange={handleChangeInput}
        />
        {errors.patientName && (
          <span className="error">{errors.patientName}</span>
        )}

                <input
          className="client-input"
          type="date"
          placeholder="Date"
          name="assignDate"
          value={newClient.assignDate}
          onChange={handleChangeInput}
        />
        {errors.assignDate && (
          <span className="error">{errors.assignDate}</span>
        )}
     
        <input
          className="client-input"
          type="text"
          placeholder="DOB"
          name="dob"
          value={newClient.dob}
          onChange={handleChangeInput}
        />
        {errors.dob && <span className="error">{errors.dob}</span>}
    

    
        <input
          className="client-input"
          type="number"
          placeholder="Number"
          name="PhoneNumber"
          value={newClient.PhoneNumber}
          onChange={handleChangeInput}
        />
        {errors.PhoneNumber && (
          <span className="error">{errors.PhoneNumber}</span>
        )}
    
        <input
          className="client-input"
          type="text"
          placeholder="Place"
          name="place"
          value={newClient.place}
          onChange={handleChangeInput}
        />
        {errors.place && <span className="error">{errors.place}</span>}
              
              
            </div>}
            <button onClick={handleAddClient} className="add-client-btn">
                Add New Client
              </button>
              <button style={{marginTop:"5px"}} onClick={(e) => {setShowForm(false)}} className="add-client-btn">
                Cancel
              </button>
          </div> */}
       
          {
          Array.isArray(getPaginatedData()) && getPaginatedData()?.map((patient) => (
            <div
              key={patient.id}
              className="patient-card animate__animated animate__fadeInLeft"
              onClick={() => handlePatientSelect(patient)} // Update selectedPatient state
              style={{
                // backgroundColor: selectedPatient?.uhid === patient.uhid ? "rgb(248, 144, 174)" : "white",
                border: selectedPatient?.uhid === patient.uhid ? "2px solid rgb(251, 251, 251)" : "1px solid #ccc",
                color:selectedPatient?.uhid === patient.uhid ? "rgb(78, 88, 101)" : "rgb(77, 89, 104)",
                backgroundColor:"white",
                cursor: "pointer",
                padding: "10px",
                margin: "5px 0",
                height:"100px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease, border 0.3s ease",
              }}
            >

              <div className="patient-main-card">
                <h5 className="patient-para">
                  {patient.patientName.charAt(0).toUpperCase() + patient.patientName.slice(1)}
                </h5>
                <p className="patient-para">DOB: {patient.dob}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p
                  style={{
                    textAlign: "start",
                    marginTop: "10px",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  Feedback 
                </p>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card selection when clicking the button
                      handleHistory(patient);
                    }}
                    // disabled={!patient.history}
                    className="history-btn"
                  >
                    <HistoryIcon sx={{ fontSize: "18px", color: "black" }} />
                    <span style={{ color: "black" }}>History</span>
                  </button>
                </div>
              
              </div>
            </div>
          ))}
            
        </div>
        <div style={{
          display:"flex",
          alignItems:"center",
          justifyContent:'center',
          flexDirection:"row",
          // alignItems:"center",
          // marginLeft:"25px",
          // alignContent: "center"
              
            }}>   <button
           style={{
             backgroundColor: "rgb(251,43,102)",
             width:"40px",
             height:"30px",
             color: "white",
             padding: "5px",
             border:"white",
             borderRadius: "5px",
             marginRight: "10px",
           }}
           onClick={handlePrev}
           disabled={paginationData === 1}
         >
           Prev
         </button>
         <div
           style={{
             backgroundColor: "rgb(251,43,102)",
             width:"100px",
             height:"30px",
             color: "white",
             border:"white",
             padding: "5px",
            //  marginTop:"50px",
             borderRadius: "5px",
           }}
         >
           {" "}
           Page {paginationData} of {totalPages}{" "}
         </div>
         <button
           style={{
             backgroundColor: "rgb(251,43,102)",
             width:"40px",
             height:"30px",
             color: "white",
             border:"white",
             padding: "5px",
             borderRadius: "5px",
             marginLeft: "10px",
           }}
           onClick={handleNext}
           disabled={paginationData === totalPages}
         >
           Next
         </button></div>
      </div>
  

      <div className="main-content" id="print-content">
        <div>{getPatientDetails(patientObj)}</div>
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
                        patientHistory[currentPage - 1]?.conversationDate.split("T")[0];
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

        <div className="conversation-summary" style={{ textAlign: "left" }}>
          {sectionTitles.map(({ key, title }) => (
            <div
              className="section"
              key={key}
              onDoubleClick={() => setEditingField(key)}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedSections.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
              </label>

              <div style={{ flex: 1 }}>
                <h4 className="header-text" style={{ margin: "0 0 5px 0" }}>
                  {title}
                </h4>

                {key === 'socialHistory' ? (
                  <div>
                    {patientData[key]?.map((item, index) => (
                      <div key={index}>
                        {Object.entries(item).map(([subKey, subValue]) => (
                          <p key={subKey}>
                            <strong>{subKey}:</strong> {subValue}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  editingField === key ? (
                    <input
                      className="edit-input-fields"
                      type="text"
                      value={patientData[key] || ""}
                      onChange={(e) => handleInputChange(e, key)}
                      onBlur={() => setEditingField(null)}
                      autoFocus
                    />
                  ) : (
                    <p>{patientData[key] || "Not specified"}</p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>



        <div className="buttons-container">
          <div style={{ alignItems: "flex-end" }}>
            <button
              // onClick={handleEditToggle}
              className="markAs-complete"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1976d2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2196f3")}
              // onClick={handleMarkAsCompleted}
              onClick={openDialog}
            >
              Mark As Completed
            </button>
            <button
              onClick={handleDataSave}
              className="conversation-save"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1976d2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4685d1")}
            >
              Save
            </button>
            <button
              className="print-button"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5290b1")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#005480")}
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      </div>
      {/* backgroundColor: "#ece9e9", */}
      <div style={{ width: "25%", backgroundColor: "#8fb7d919" }}>
        <div className="chat-box">
          {isRecording ? (
            <div style={{ color: "black", margin: "10px" }}>
              <h5 className="recording-audio-header">
                Recording Audio: {formatTime(recordingTime)}
              </h5>

              {/* Wave Container */}
              <div className="wave-container">
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>

                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
                <div className="wave-line"></div>
              </div>
            </div>
          ) : (
            <>
              <h5 className="recorded-audio-header">Recorded Audio:</h5>
              {audioUrl ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <audio
                    src={audioUrl}
                    controls
                    autoPlay
                    onCanPlay={() => console.log("Audio Ready to Play")}
                    style={{ width: "250px" }}
                  />
                </div>
              ) : (
                <p className="no-audio-style">No audio available to play</p>
              )}
            </>
          )}
        </div>

        <div className="conversation-log">
          <h4 style={{ fontSize: "13px", textAlign: "center" }}>
            Lawyer and Client Conversation
          </h4>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            <div>
              {Array.isArray(patientData?.conversation) && patientData?.conversation.length > 0 ? (
                patientData?.conversation.map((messageObj, index) => {
                  const sender = messageObj.includes("Doctor") ? "Doctor" : "Patient";
                  const message = messageObj.trim();

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: sender === "Doctor" ? "flex-start" : "flex-end",
                        margin: "10px 0",
                      }}
                    >
                      <div
                        className={`message ${sender === "Doctor"
                          ? "doctor-message"
                          : "patient-message"
                          }`}
                      >
                        <p>{message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: "center" }}>
                  No conversation available.
                </p>
              )}
            </div>
          )}

          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">
              {"Confirm Action"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to mark this patient as completed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
