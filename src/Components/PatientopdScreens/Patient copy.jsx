import React, { useState, useEffect } from 'react';
import { Button, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import './Patient.css';
import { resources } from '../Resourses/Resourses';
import AuthService from '../LoginSignUpScreens/AuthService';
import PerceptionRemainder from './PerceptionRemainder';
import FeedbackAnalysis from './FeedbackAnalysis';
import Typography from '@mui/material/Typography';
import NavBar from '../ReusableComponent/NavBar';
import Cookies from "js-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './PerceptionRemainder.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';


function PatientRegistrationForm() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await Cookies.remove("userInfo");
        navigate("/Login");
        window.location.reload();
    };

    const navItems = [
        // { label: 'Home', onClick: () => console.log('Home clicked') },
        // { label: 'About', onClick: () => console.log('About clicked') },
        { label: 'LogOut', onClick: handleLogout },
    ];

    const [formData, setFormData] = useState({
        uhid: "", mobile: "", idProofType: "", idNumber: "", datevalue: "",
        department: "", panel: "", namesalute: "", patientName: "", gender: "", martialStatus: "", address: "",
        bloodGroup: "", doctorName: "", slot: "", opdFee: "", relationsdwo: "", sWDofName: "", selectRelation: "", dob: "", age: "",
        resident: "", state: "", city: "", email: "", payment: "", cardNo: "", service: "", rank: "", source: "",
        discount: "", remark: "", selectReferal: "", referalMobileNo: "", doctorId: "", doctorEmail: ""
    });


    const [currentTab, setCurrentTab] = useState('patient-details');
    const [image, setImageData] = useState(null);
    const [image1, setImage1] = useState(null);
    const [getPatientData, SetGetPatientData] = useState({ searchinput: "" });
    const [department, setDepartment] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState([]);
    const [receiptionistId, setReceiptionistId] = useState(null);
    const [doctorNames, setDoctorNames] = useState([]);
    const [viewDetails, setViewDetails] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedObj,setEditedObj] = useState({});


    const handleFileChange = (e) => {
        setImageData(e.target.files[0]);
    };

    const ConvertBlob = (Obj) => {
        return new Blob([JSON.stringify(Obj)], { type: 'application/json' });
    };



    const doctor = doctorDetails.find((doc) => doc.username === formData?.doctorName);

    const handleSubmit = async () => {
        console.log("getDataSubmit--->", doctor?.id)
        const updatedFormData = {
            ...formData,
            doctorId: doctor?.id,
            doctorEmail: doctor?.email
        };
        console.log("form data===>", formData)
        const form = new FormData();
        form.append("patientdetails", ConvertBlob(updatedFormData));
        form.append('image', image);

        try {
            console.log("data is", form.values);

            const response = await axios.post(`${resources.APPLICATION_URL}patientRegister?receptionistId=${receiptionistId}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            if (response.status === 201) {
                console.log("Data was inserted", response.data);
                alert('Patient registered successfully');
            } else {
                console.log("Failed", response.data);
                // alert("Registration failed");
            }
        } catch (error) {
            alert("Something went wrong with the registration, please try again later.");
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the field is a date, format the value to 'YYYY-MM-DD' before updating state
        if (name === 'datevalue' || name === "dob") {
            const formattedDate = formatDate(value); // Convert to YYYY-MM-DD
            setFormData({
                ...formData,
                [name]: formattedDate,
            });
            setEditedObj({
                ...editedObj,
                [name]: formattedDate,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
            setEditedObj({
                ...editedObj,
                [name]: value,
            });
        }
    };

    const formatReverseDate = (dateString) => {
        const [day, month, year] = dateString?.split('-');
        return `${year}-${month}-${day}`;
    };


    const searchInputChange = (e) => {
        const { value } = e.target;
        SetGetPatientData({ searchinput: value });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSearch = async () => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}patientDetailsById?patientId=${formData.uhid}`);
            console.log("res===>", JSON.stringify(res.data));

            // Fetch doctor details based on the department
            if (res.data.department) {
                const doctorResponse = await axios.get(`${resources.APPLICATION_URL}getDoctorsOnly?department=${res.data.department}`);
                setDoctorDetails(doctorResponse.data); // Update doctor details list

                // Extract doctor names from the doctor details
                const doctorNamesList = doctorResponse.data.map((doc) => doc.username);
                setDoctorNames(doctorNamesList);
            }

            // Update formData after fetching doctor details
            setFormData({
                ...res.data,
                doctorName: res.data.doctorName, // Ensure doctorName is set correctly
            });
        } catch (e) {
            console.log("error", e);
        }
    };



    const handleDepartments = async () => {
        try {
            const response = await axios.get(`${resources.APPLICATION_URL}getDistinctDepartments`);
            console.log("response data is==>", response.data)
            const departments = response.data;
            setDepartment(departments);
        } catch (error) {
            console.error('Error fetching patient details:', error);
            alert("Error fetching patient details. Please try again.");
        }
    };

    useEffect(() => {
        handleDepartments();
    }, []);

    const getDoctorsDetails = async (doctor) => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}getDoctorsOnly?department=${doctor}`);
            const doctorNames = res.data.map(doctor => doctor.username);
            setDoctorNames(doctorNames);
            console.log("doctorNames===>", JSON.stringify(doctorNames))

            setDoctorDetails(res.data);
        }
        catch (e) {
            console.log("error", e)
        }
    }

    const fetchUserRole = async () => {
        const user = await AuthService.getCurrentUSer();
        console.log("userData===>", JSON.stringify(user?.doctorId))
        setReceiptionistId(user?.doctorId);
    };


    const getViewDetails = async () => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}getAllPatientDetails?receptionistId=${receiptionistId}`);
            setViewDetails(res.data);
            console.log("resDataa==>", res.data)
        }
        catch (e) {
            console.log("error", e)
        }
    }


    const handleEditClick = async (item) => {
        setIsEditing(true);
        if (item.department) {
            console.log("item--",item)
            
            const doctorResponse = await axios.get(`${resources.APPLICATION_URL}getDoctorsOnly?department=${item.department}`);
            setDoctorDetails(doctorResponse.data); // Update doctor details list

            // Extract doctor names from the doctor details
            const doctorNamesList = doctorResponse.data.map((doc) => doc.username);
            setDoctorNames(doctorNamesList);
        }
        setFormData(item);
        setEditedObj(item)
    };

    const handleEditedData = async () => {
        setIsEditing(true);
        try {
            const res = await axios.put(`${resources.APPLICATION_URL}updatePatientDetails`,editedObj);
            if (res.data.department) {
                const doctorResponse = await axios.get(`${resources.APPLICATION_URL}getDoctorsOnly?department=${res.data.department}`);
                setDoctorDetails(doctorResponse.data); // Update doctor details list
                // Extract doctor names from the doctor details
                const doctorNamesList = doctorResponse.data.map((doc) => doc.username);
                setDoctorNames(doctorNamesList);
                getViewDetails();
            }
        }
        catch (e) {
            console.log("error", e)
        }
    };

    const handleDelete = async (id) =>{
        try{
            const res = await axios.delete(`${resources.APPLICATION_URL}deleteByPatientId?patientId=${id}`)
            getViewDetails()
        }
        catch(e){
            console.log("error",e)
        }
    }

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        getViewDetails();
    }, [receiptionistId])

    return (
        <div>
            <NavBar brandName="Patient Details " navItems={navItems} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => setCurrentTab(newValue)}
                    className="dynamic_tabs"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}

                >
                    <Tab
                        className="dynamic_tab"
                        value="patient-details"
                        label="Patient Details"
                        sx={{
                            margin: '0px 5px',
                            backgroundColor: currentTab === "patient-details" ? "green" : "blue",
                            color: "white",
                            fontWeight: "bold",
                            "&.Mui-selected": {
                                backgroundColor: "green",
                                color: "white",
                                borderBottom: "2px solid white",
                            },
                            "&:hover": {
                                backgroundColor: "darkblue",
                            },
                        }}
                    />
                    <Tab
                        className="dynamic_tab"
                        value="preception-remainder"
                        label="Preception Remainder"
                        sx={{
                            margin: '0px 5px',
                            backgroundColor: currentTab === "preception-remainder" ? "green" : "blue",
                            color: "white",
                            fontWeight: "bold",
                            "&.Mui-selected": {
                                backgroundColor: "green",
                                color: "white",
                                borderBottom: "2px solid white",
                            },
                            "&:hover": {
                                backgroundColor: "darkblue",
                            },
                        }}
                    />
                    <Tab
                        className="dynamic_tab"
                        value="feedback-analysis"
                        label="Feedback Analysis"
                        sx={{
                            margin: '0px 5px',
                            backgroundColor: currentTab === "feedback-analysis" ? "green" : "blue",
                            color: "white",
                            fontWeight: "bold",
                            "&.Mui-selected": {
                                backgroundColor: "green",
                                color: "white",
                                borderBottom: "2px solid white",
                            },
                            "&:hover": {
                                backgroundColor: "darkblue",
                            },
                        }}
                    />
                </Tabs>

            </Box>
            <div style={{ maxHeight: "500px", height: "500px", overflowY: "auto", }}>
                {currentTab === 'patient-details' && (
                    <>
                        <div>
                            <div className="search-wrapper">
                                <div>
                                    <label>Enter UHID</label>
                                    <input name="uhid" value={formData?.uhid} onChange={handleInputChange} style={{ height: "30px", width: "150px" }} />
                                </div>
                                <div>
                                    <Button onClick={handleSearch} className="topsearch">Search</Button>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="one">
                                    <label>ID Proof Type</label>
                                    <select name="idProofType" value={formData?.idProofType} onChange={handleInputChange} style={{ height: "40px", width: "150px" }}>
                                        <option value="">-- Select ID Proof --</option>
                                        <option value="Aadhar">Aadhar</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Voter ID">Voter ID</option>
                                    </select>
                                </div>

                                <div className="one">
                                    <label>ID Number</label>
                                    <input name="idNumber" value={formData?.idNumber} onChange={handleInputChange} style={{ height: "40px", width: "150px" }} />
                                </div>
                                <div className="one">
                                    <label>Mobile</label>
                                    <input name="mobile" value={formData?.mobile} onChange={handleInputChange} style={{ height: "40px", width: "150px" }} />
                                </div>

                                <div className="one">
                                    <label>Patient Name</label>
                                    <input name="patientName" value={formData?.patientName} onChange={handleInputChange} style={{ height: "40px", width: "150px" }} />
                                </div>
                                <div className="one">
                                    <label>Age</label>
                                    <input name="age" value={formData?.age} onChange={handleInputChange} style={{ height: "40px", width: "150px" }} />
                                </div>
                                <div className="one">
                                    <label>Date</label>
                                    <input
                                        style={{ height: "40px", width: "150px" }}
                                        name="datevalue"
                                        type="date"  
                                        value={formatReverseDate(formData?.datevalue)}
                                        onChange={(e) => { handleInputChange(e); formatDate(formData.datevalue) }}
                                        InputLabelProps={{
                                            shrink: true, 
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                padding: '8px',
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: 0,
                                            }
                                        }}
                                        variant="outlined"
                                    />
                                </div>


                                <div className="one">
                                    <label>Department</label>
                                    <select name="department" value={formData?.department} onChange={(e) => { handleInputChange(e); getDoctorsDetails(e.target.value) }} >
                                        <option value="">-- Select Department --</option>
                                        {department?.map(department => (
                                            <option key={department} value={department}>{department}</option>
                                        ))}
                                    </select>
                                </div>


                                <div className='one'>
                                    <label>Doctor</label>
                                    <select
                                        name="doctorName"
                                        onChange={handleInputChange}
                                        value={formData?.doctorName}
                                    >
                                        <option value="">Please Select</option>
                                        {doctorNames &&
                                            doctorNames
                                                .filter((each) => each !== "")
                                                .map((each, i) => (
                                                    <option key={i} value={each}>
                                                        {each}
                                                    </option>
                                                ))}
                                    </select>
                                </div>

                                <div className="one">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>

                                <div className="one">
                                    <label>Marital Status</label>
                                    <select name="martialStatus" value={formData.martialStatus} onChange={handleInputChange}>
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {/* <input name="martialStatus" value={formData.martialStatus} onChange={handleInputChange} /> */}
                                </div>

                                <div className="one">
                                    <label>Address</label>
                                    <input name="address" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Blood Group</label>
                                    <input name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} />
                                </div>

                                <div className="one">
                                    <label>Slot</label>
                                    <input name="slot" value={formData.slot} onChange={handleInputChange} />
                                </div>

                                <div className="one">
                                    <label>Relation</label>
                                    <select name="relationsdwo" value={formData.relationsdwo} onChange={handleInputChange}>
                                        <option value="">-- Select Relation --</option>
                                        <option value="S/O">S/O</option>
                                        <option value="W/O">W/O</option>
                                        <option value="D/O">D/O</option>
                                    </select>
                                </div>
                                <div className="one">
                                    <label>S/W/D of Name</label>
                                    <input name="sWDofName" value={formData.sWDofName} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Select Relation</label>
                                    <input name="selectRelation" value={formData.selectRelation} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Date of Birth</label>
                                    {/* <input name="dob" value={formData.dob} onChange={handleInputChange} /> */}
                                    <input
                                        name="dob"
                                        type="date"  // Add the type as 'date'
                                        // value={formData.dob}
                                        value={formatReverseDate(formData?.dob)}
                                        // onChange={handleInputChange}
                                        onChange={(e) => { handleInputChange(e); formatDate(formData.dob) }}
                                        InputLabelProps={{
                                            shrink: true, // To ensure the label shrinks when a date is selected
                                        }}
                                        sx={{
                                            // padding: 2px, // Remove padding from the outer container
                                            '& .MuiOutlinedInput-root': {
                                                padding: '8px', // Remove padding inside the input field
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: 0, // Remove padding from the input text
                                            }
                                        }}
                                        variant="outlined"
                                    />
                                </div>
                                <div className="one">
                                    <label>State</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Email</label>
                                    <input name="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Payment Method</label>
                                    <input name="payment" value={formData.payment} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Card Number</label>
                                    <input name="cardNo" value={formData.cardNo} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Service</label>
                                    <input name="service" value={formData.service} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Rank</label>
                                    <input name="rank" value={formData.rank} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Source</label>
                                    <input name="source" value={formData.source} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Discount</label>
                                    <input name="discount" value={formData.discount} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Remark</label>
                                    <input name="remark" value={formData.remark} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Select Referral</label>
                                    <input name="selectReferal" value={formData.selectReferal} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Referral Mobile No</label>
                                    <input name="referalMobileNo" value={formData.referalMobileNo} onChange={handleInputChange} />
                                </div>
                                <div className="one">
                                    <label>Upload Image</label>
                                    <input type="file" onChange={handleFileChange} />
                                    {image1 && <img src={image1} style={{ width: '200px' }} alt="Patient" />}
                                </div>
                            </div>
                            {isEditing ? <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                                <Button variant="contained" color="primary" onClick={handleEditedData} style={{ width: "200px" }} >
                                    Save
                                </Button>
                            </div>:<div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                                <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: "200px" }} >
                                    Register
                                </Button>
                            </div>}
                            
                        </div>

                        <div className='ERP_table'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.NO</th>
                                        <th>UHID ID</th>
                                        <th>PATIENT NAME</th>
                                        <th>DOCTOR</th>
                                        <th>DEPARTMENT</th>
                                        <th>MODE</th>
                                        <th>PROCESS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewDetails.map((item, index) => (
                                        <tr key={item.patientId}>
                                            <td>{index + 1}</td>
                                            <td>{item.uhid}</td>
                                            <td>{item.patientName}</td>
                                            <td>{item.doctorName}</td>
                                            <td>{item.department}</td>
                                            <td>{item.payment}</td>
                                            <td>
                                                <EditIcon
                                                    onClick={() => handleEditClick(item)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <DeleteIcon style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={()=>handleDelete(item.uhid)} />
                                            </td>
                                        </tr>))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {currentTab === 'preception-remainder' && (
                    <PerceptionRemainder />
                )}
                {currentTab === 'feedback-analysis' && (
                    <FeedbackAnalysis />
                )}
            </div>
        </div>



    );
}

export default PatientRegistrationForm;
