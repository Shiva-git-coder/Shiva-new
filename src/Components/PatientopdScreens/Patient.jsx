import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Tabs, Tab } from "@mui/material";
import axios from "axios";
import "./Patient.css";
import { resources } from "../Resourses/Resourses";
import AuthService from "../LoginSignUpScreens/AuthService";
import PerceptionRemainder from "./PerceptionRemainder";
import FeedbackAnalysis from "./FeedbackAnalysis";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./PerceptionRemainder.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "../ReusableComponent/Loader";
import SearchIcon from "@mui/icons-material/Search";

function PatientRegistrationForm() {
  const successMessage = (message) => {
    toast.success(message, {
      position: "top-center",
    });
  };

  const errorMessage = (message) => {
    toast.error(message, {
      position: "top-center",
    });
  };

  const navigate = useNavigate();

  const location = useLocation();
  const patientData = location.state?.patientData || null;

  console.log("Patient data ========>", patientData);

  const [email, setEmail] = useState("");

  // useEffect(() => {
  //     if (patientData) {
  //         getDoctorsDetails(patientData?.department);
  //         setFormData(prevData => ({
  //             ...prevData,
  //             ...patientData
  //         }));
  //     }
  // }, [patientData]);

  const handleLogout = async () => {
    await Cookies.remove("userInfo");
    navigate("/");
    window.location.reload();
  };

  const navItems = [{ label: "LogOut", onClick: handleLogout }];

  const [idNumber,setIdNumber] = useState('')

  const [formData, setFormData] = useState({
     idNumber: "",
    patientName: "",
    dob: "",
    history: "",
    datevalue: "",
    address: "",
    mobile: "",
    email: "",
    doctorId:"",


    // uhid: "", mobile: "", idProofType: "", idNumber: "", datevalue: "",
    // department: "", panel: "", namesalute: "", patientName: "", gender: "", martialStatus: "", address: "",
    // bloodGroup: "", doctorName: "", slot: "", opdFee: "", relationsdwo: "", sWDofName: "", selectRelation: "", dob: "", age: "",
    // resident: "", state: "", city: "", email: "", payment: "", cardNo: "", service: "", rank: "", source: "",
    // discount: "", remark: "", selectReferal: "", referalmobileNo: "", doctorId: "", doctorEmail: ""
  });
//   const [errors, setErrors] = useState({
//      idNumber: "",
//     patientName: "",q    ```````````````````````````````````````````
//     dob: "",
//     datevalue: "",
//     mobile: "",
//     address: "",
//   });

  // const [currentTab, setCurrentTab] = useState('patient-details');
  // const [image, setImageData] = useState(null);
  // const [image1, setImage1] = useState(null);
  // const [getPatientData, SetGetPatientData] = useState({ searchinput: "" });
  // const [department, setDepartment] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [receiptionistId, setReceiptionistId] = useState(null);
  // const [doctorNames, setDoctorNames] = useState([]);
  // const [viewDetails, setViewDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [selectedPatientId, setSelectedPatientId] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [availableSlots,setAvailableSlots] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  // console.log(availableSlots, "availableSlots")
  // const totalPages = Math.ceil(viewDetails.length / itemsPerPage);

  // const currentItems = viewDetails.slice(
  //     (currentPage - 1) * itemsPerPage,
  //     currentPage * itemsPerPage
  // );

  // const handlePageChange = (newPage) => {
  //     setCurrentPage(newPage);
  // };

  // const handleFileChange = (e) => {
  //     setImageData(e.target.files[0]);
  // };

  const ConvertBlob = (Obj) => {
    return new Blob([JSON.stringify(Obj)], { type: "application/json" });
  };

  // const doctor = doctorDetails.find((doc) => doc.username === formData?.doctorName);

  const handleSubmit = async () => {
    const {  uhid, ...updatedFormData } = formData;

    const formDataWithDoctor = {
      ...updatedFormData, idNumber:idNumber
    };



    const form = new FormData();
    form.append("patientdetails", ConvertBlob(formDataWithDoctor));

    try {
      console.log("data is", form.values);

      const response = await axios.post(
        `${resources.APPLICATION_URL}patientRegister?receptionistId=${receiptionistId}&dateValue=${formattedDate}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      getViewDetails();
      successMessage("Patient Registered Successfully!!");
      setFormData((prev) => ({
        ...prev,
         idNumber: "",
        patientName: "",
        dob: "",
        datevalue: "",
        mobile: "",
        address: "",
        age:''
      }));
      setIdNumber('')

      if (response.status === 200) {
        console.log("Data was inserted", response.data);
        // alert('Patient registered successfully');
      } else {
        console.log("Failed", response.data);
        errorMessage("Failed To Save!!");
      }
    } catch (error) {
      alert(
        "Something went wrong with the registration, please try again later."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
        console.log("name=====>", name, value )
     
    if (name === "uhid" && value.trim() === "") {
      setFormData((prev) => ({
        ...prev,
         idNumber: "",
        patientName: "",
        dob: "",
        // history: "",
        datevalue: "",
        age: "",
        address: "",
        mobile: "",
      }));
      setIsEditing(false);
    } else if (name === "datevalue" || name === "dob") {
      const formattedDate = formatDate(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formatReverseDate = (dateString) => {
    const [day, month, year] = dateString?.split("-");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchUserRole = async () => {
    const user = await AuthService.getCurrentUSer();
    console.log("user===>", user);
    formData.email = user?.email;
    formData.doctorId = user?.doctorId;
    setReceiptionistId(user?.doctorId);
  };

  console.log("detailsId--->", receiptionistId);

  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  console.log("formattedDate--->", formattedDate);

  const getViewDetails = async () => {
    // setLoading(true)
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}getAllPatientDetails?receptionistId=${receiptionistId}&datevalue=${formattedDate}`
      );
      setViewDetails(res.data);
      console.log("resDataa==>", res.data);
    } catch (e) {
      console.log("error", e);
    } finally {
      // setLoading(false)
    }
  };

  // const handleEditClick = async (item) => {
  //     try {
  //         setIsEditing(true);

  //         if (item.department) {
  //             console.log("Editing Item:", item.department);

  //             const doctorResponse = await axios.get(
  //                 `${resources.APPLICATION_URL}getDoctorsOnly?department=${item.department}`
  //             );

  //             setDoctorDetails(doctorResponse.data);

  //             const doctorNamesList = doctorResponse.data.map((doc) => doc.username);
  //             setDoctorNames(doctorNamesList);

  //             setFormData((prev) => ({
  //                 ...prev,
  //                 ...item,
  //             }));
  //         }
  //     } catch (error) {
  //         console.error("Error in handleEditClick:", error);
  //     }
  // };

  useEffect(() => {
    fetchUserRole();
  }, []);

  // useEffect(() => {
  //     getViewDetails();
  // }, [receiptionistId])

  // useEffect(() => {
  //     if (patientData) {
  //         getDoctorsDetails(patientData?.department);
  //         setFormData(prevData => ({
  //             ...prevData,
  //             ...patientData
  //         }));
  //     }
  // }, [patientData]);

  // useEffect(() => {
  //     if (patientData) {
  //         console.log("Fetching doctor details for department:", patientData?.department);
  //         getDoctorsDetails(patientData?.department);
  //         setFormData(prevData => ({
  //             ...prevData,
  //             ...patientData
  //         }));
  //     } else {
  //         console.log("No patient data available");
  //     }
  // }, [patientData]);

  console.log("formData.doctorName-->", formData.doctorName);

  //     const id = doctorDetails?.find(item => item?.username === formData?.doctorName);
  //     console.log("doctorIdGetting--->", id);

  //     axios.get(`${resources.APPLICATION_URL}getAvailableSlots`, {
  //         params: {
  //             patientEmail: formData.email,
  //             doctorId: id?.id,
  //             datevalue: formData.datevalue
  //         }
  //     }).then(response => {
  //         console.log(response);
  //         if (Array.isArray(response.data)) {
  //             console.log(response.data,"res data")
  //             setAvailableSlots(response.data)
  //         }

  //     }).catch(error => {
  //         console.log(error)
  //     })

  // }

  // useEffect(() => {
  //     console.log("doctorDetails--12345>",doctorDetails);
  //     if (doctorDetails && doctorDetails.length > 0) {
  //         getAvailableSlts(doctorDetails);
  //     }
  // }, [doctorDetails, formData.datevalue, formData.email,formData.doctorName]);

  return (
    <>
      <div
        className="opd-container"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <div className="uhid-container">
          <div className="Label_data">
            <label className="">ID Number :</label>
            <label className="">Lawyer ID :</label>
            <label className="">Client Name :</label>
            <label className="">mobile :</label>
            <label className="">Date :</label>
            <label className="">Age :</label>
            <label className="">email :</label>
            <label className="">Date of Birth :</label>
            <label className="">Address :</label>
         
          </div>

          <div className="input_tags">
            <input
            type="text"
              name=" idNumber"
              value={idNumber}
            //   onChange={handleInputChange}
            onChange={(e) => {setIdNumber( e.target.value) ; console.log(e.target.value)}}
              className="input_tabs"
            />
             <input
                name="doctorId"
                value={formData?.doctorId}
                // readOnly
                onChange={handleInputChange}
                addressholder="Id"
                className="input_tabs"
              />
            <input
              name="patientName"
              value={formData?.patientName}
              onChange={handleInputChange}
              addressholder="patientName"
              className="input_tabs"
            />
              <input
                name="mobile"
                value={formData?.mobile}
                onChange={handleInputChange}
                className="input_tabs"
              />
               <input
              name="datevalue"
              type="date"
              value={formatReverseDate(formData?.datevalue)}
              onChange={(e) => {
                handleInputChange(e);
                formatDate(formData.datevalue);
              }}
              className="date-input"
            />
              <input
                name="age"
                value={formData?.age}
                onChange={handleInputChange}
                addressholder="age"
                className="input_tabs"
              />
               <input
                name="email"
                value={formData?.email}
                readOnly
                onChange={handleInputChange}
                addressholder="email"
                className="input_tabs"
              />
               <input
              className="dob-input"
              name="dob"
              type="date"
              value={formatReverseDate(formData?.dob)}
              onChange={(e) => {
                handleInputChange(e);
                formatDate(formData.dob);
              }}
            />
              <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input_tabs"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginLeft: "8px" }}>
          {isEditing ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditedData}
                style={{ width: "200px" }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginLeft:"450px", width: "200px", backgroundColor: "#FB2B66" }}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PatientRegistrationForm;
