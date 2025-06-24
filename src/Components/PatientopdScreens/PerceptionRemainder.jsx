import { useState, useEffect, useMemo } from 'react';
import './PerceptionRemainder.css'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, TextField, Tab, Tabs } from '@mui/material';
import AuthService from '../LoginSignUpScreens/AuthService';
import axios from 'axios';
import { resources } from '../Resourses/Resourses';
import { toast } from "react-toastify";
import Loader from '../ReusableComponent/Loader';
import React from 'react';

function PerceptionRemainder() {
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

    const [currentTab, setCurrentTab] = useState('remainder-today');
    const [patientsData, setPatientsData] = useState([])
    const [tempFields, setTempFields] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [searchTermIncomplete, setSearchTermIncomplete] = useState('');
    const [searchTermCompleted, setSearchTermCompleted] = useState('');
    const [loading, setLoading] = useState(false);

    const renderField = (label, value) => (
        <div className='remainder-returnfield' >
            <label className='remainder-returnfield-label'>
                {label}
            </label>
            <input
                type="text"
                value={value}
                className='remainder-returnfield-input'
                readOnly
            />
        </div>
    );

    const incompletePatients = useMemo(() => {
        console.log(" ======>",patientsData);
        return patientsData
            .filter(item => hasEmptyFields(item))
            .filter(item =>
                item.patientId.toLowerCase().includes(searchTermIncomplete.toLowerCase()) ||
                item.patientName.toLowerCase().includes(searchTermIncomplete.toLowerCase()) ||
                item.mobile.toLowerCase().includes(searchTermIncomplete.toLowerCase())
            )
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }, [patientsData, searchTermIncomplete]);

    const completedPatients = useMemo(() => {
        
        return patientsData
            .filter(item => !hasEmptyFields(item))
            .filter(item =>
                item.patientId.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
                item.patientName.toLowerCase().includes(searchTermCompleted.toLowerCase()) ||
                item.mobile.toLowerCase().includes(searchTermCompleted.toLowerCase())
            )
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }, [patientsData, searchTermCompleted]);

    const CompletedPatients = (id) => {
        setLoading(true);
        axios.get(`${resources.APPLICATION_URL}eligibleForMedicineAnalysis`, {
            params: {
                receptionistId: id
            }
        }).then(response => {
            console.log(response);
            if (Array.isArray(response.data)) {
                setPatientsData(response.data);
            }             
        }).catch(error => {
            console.log(error);
            errorMessage('Failed To Load The Data')
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        async function fetchUserRole() {
            const user = await AuthService.getCurrentUSer();
            
            setUserId(user.doctorId);
            CompletedPatients(user.doctorId);
        }
        fetchUserRole();

    }, []);


    function hasEmptyFields(item) {
        return (
            !item.remainderTime ||
            !item.noOfDays
        );
    };
    const [formdata, setFormData] = useState({
        uhid: '',
        mobile: '',
        idNumber: '',
        patientName: '',
        datevalue: '',
        department: '',
        panel: '',
        namesalute: '',
        gender: '',
        martialStatus: '',
        address: '',
        bloodGroup: '',
        doctorName: '',
        doctorEmail: '',
        doctorId: '',
        slot: '',
        opdFee: '',
        relationsdwo: '',
        selectRelation: '',
        dob: '',
        age: '',
        resident: '',
        state: '',
        city: '',
        email: '',
        idProofType: '',
        cardNo: '',
        service: '',
        rank: '',
        source: '',
        discount: '',
        payment: '',
        remark: '',
        selectReferal: '',
        referalMobileNo: '',
        image: '',
        onlydate: '',
        uploadDate: '',
        swdofName: ''
    });


    const handleTempChange = (e, index, field) => {
        const value = e.target.value;
        setTempFields((prevState) => {
            const updatedTempFields = {
                ...prevState,
                [`${index}-${field}`]: value,
            };
            if (field === "noOfDays") {
                const numberOfDays = value;
                const calculatedDate = addDaysToCurrentDate(numberOfDays);
                updatedTempFields[`${index}-endDate`] = calculatedDate;
            }
            return updatedTempFields;
        });
    };


    const addDaysToCurrentDate = (days) => {
        if (!days) {
            return "-";
        }
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + parseInt(days));
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = (index, id) => {
        const updatedRow = patientsData.find(item => item.uniqKey === id);
        const newRow = {
            ...updatedRow,
            remainderTime: tempFields[`${index}-remainderTime`] || updatedRow.remainderTime,
            noOfDays: tempFields[`${index}-noOfDays`] || updatedRow.noOfDays,
            endDate: tempFields[`${index}-noOfDays`]
                ? addDaysToCurrentDate(tempFields[`${index}-noOfDays`])
                : updatedRow.endDate || "-",
        };

        setLoading(true);
        axios.post(`${resources.APPLICATION_URL}savePatientEnquiryDetails`, newRow).then(response => {
            if (response.data.status === "true") {
                successMessage(response.data.message);
                setPatientsData((prevData) =>
                    prevData.map((item) =>
                        item.uniqKey === id ? newRow : item
                    )
                );
            }
            else {
                errorMessage(response.data.message)
            }
        }).catch((error) => {
            console.error("Error saving data:", error);
            errorMessage("Failed To Save The Data")
        }).finally(() => setLoading(false))

        setTempFields((prev) => {
            const newFields = { ...prev };
            delete newFields[`${index}-remainderTime`];
            delete newFields[`${index}-noOfDays`];
            delete newFields[`${index}-ivrStatus`];
            delete newFields[`${index}-endDate`];
            return newFields;
        });
    };

    const isRowComplete = (item) => {
        return (
            item.remainderTime &&
            item.noOfDays
        );
    };

    const view = (id) => {
        setLoading(true)
        axios.get(`${resources.APPLICATION_URL}patientDetailsById`, {
            params: {
                patientId: id
            }
        }).then(response => {
            const dataToShow = response.data;
            setFormData(dataToShow);
            setIsOpen(true);
        }).catch(error => {
            console.log(error);
            errorMessage("Failed To Load The Data")
        }).finally(() => setLoading(false))

};

    const closeDialog = () => {
        setFormData({
            uhid: '',
            mobile: '',
            idNumber: '',
            patientName: '',
            datevalue: '',
            department: '',
            panel: '',
            namesalute: '',
            gender: '',
            martialStatus: '',
            address: '',
            bloodGroup: '',
            doctorName: '',
            doctorEmail: '',
            doctorId: '',
            slot: '',
            opdFee: '',
            relationsdwo: '',
            selectRelation: '',
            dob: '',
            age: '',
            resident: '',
            state: '',
            city: '',
            email: '',
            idProofType: '',
            cardNo: '',
            service: '',
            rank: '',
            source: '',
            discount: '',
            payment: '',
            remark: '',
            selectReferal: '',
            referalMobileNo: '',
            image: null,
            onlydate: '',
            uploadDate: '',
            swdofName: ''
        })
        setIsOpen(false)
    }
    return (
        <div className='remainder-container'>
            <h2 className='page_title'>Prescription Remainder</h2>
            <Box className='remainder-tabcontainer' >
                {currentTab === 'remainder-today' &&
                    <input
                        type="text"
                        className='remainder-searchinput'
                        value={searchTermIncomplete}
                        onChange={(e) => setSearchTermIncomplete(e.target.value)}
                        placeholder="Search by patientId, patientName, or mobile (Incomplete)"

                    />
                }
                {currentTab === 'remainder-complete' &&
                    <input
                        type="text"
                        className='remainder-searchinput'
                        value={searchTermCompleted}
                        onChange={(e) => setSearchTermCompleted(e.target.value)}
                        placeholder="Search by patientId, patientName, or mobile"

                    />}
                <Box>
                    <Tabs
                        value={currentTab}
                        onChange={(event, newValue) => setCurrentTab(newValue)}
                        className="dynamic_tabs"
                    >
                        <Tab
                            className="dynamic_tab"
                            value="remainder-today"
                            label="Today Data"
                            sx={{
                                margin: '0px 5px',
                                textTransform: 'none',
                                fontWeight: 'medium',
                                fontSize: '16px',
                                height: '40px',
                                color: currentTab === "remainder-today" ? "white" : "black",
                                borderRadius: '8px 8px 0 0',
                                backgroundColor: currentTab === "remainder-today" ? "#F1F8E9" : "#F1F8E9",
                                "&.Mui-selected": {
                                    color: "green",
                                    borderBottom: "3px solid #00796B",
                                    backgroundColor:'white'
                                },
                                "&:hover": {
                                    color: currentTab === "remainder-today" ? 'green' : 'white',
                                    backgroundColor: "#F1F8E9",
                                },
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                        <Tab
                            className="dynamic_tab"
                            value="remainder-complete"
                            label="Completed Data"
                            sx={{
                                margin: '0px 5px',
                                height: '40px',
                                textTransform: 'none',
                                fontWeight: 'medium',
                                fontSize: '16px',
                                color: currentTab === "remainder-complete" ? "white" : "black",
                                borderRadius: '8px 8px 0 0',
                                backgroundColor: currentTab === "remainder-complete" ? "#F1F8E9" : "#F1F8E9",
                                "&.Mui-selected": {
                                    color: "green",
                                    borderBottom: "3px solid #00796B",
                                    backgroundColor:'white'
                                },
                                "&:hover": {
                                    color: currentTab === "remainder-complete" ? 'green' : 'white',
                                    backgroundColor: "#F1F8E9",
                                },
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    </Tabs>
                </Box>
            </Box>
            {currentTab === 'remainder-today' && (
                <div>
                    <div className='ERP_table'>
                        <table>
                            <thead >
                                <tr>
                                    <th>S.NO</th>
                                    <th>PatientId</th>
                                    <th>PatientName</th>
                                    <th>Mobile</th>
                                    <th>Issue</th>
                                    <th>RemainderTime</th>
                                    <th>NoOfDays</th>
                                    <th>EndDate</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {loading ? <Loader /> : (
                                <React.Fragment>
                                    {incompletePatients.length === 0 ? (<tbody>
                                        <tr>
                                            <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                                                No data Found
                                            </td>
                                        </tr>
                                    </tbody>) : (

                                        <tbody>

                                            {incompletePatients.map((item, index) => (
                                                <tr key={item.patientId}>
                                                    <td>{index + 1}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.patientId}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.patientName}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.mobile}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.issue}</td>
                                                    <td>
                                                        {(item.remainderTime === "" || item.remainderTime === null) ? (

                                                            <input
                                                                type="time"
                                                                placeholder="Enter remainderTime"
                                                                value={tempFields[`${index}-remainderTime`] || ""}
                                                                onChange={(e) => handleTempChange(e, index, "remainderTime")}
                                                                pattern="[0-9]{2}:[0-9]{2}"
                                                            />
                                                        ) : (
                                                            item.remainderTime
                                                        )}
                                                    </td>
                                                    <td>
                                                        {(item.noOfDays === "" || item.noOfDays === null) ? (
                                                            <input
                                                                type="number"
                                                                placeholder="Enter No. of Days"
                                                                value={tempFields[`${index}-noOfDays`] || ""}
                                                                onChange={(e) =>
                                                                    handleTempChange(e, index, "noOfDays")
                                                                }
                                                            />
                                                        ) : (
                                                            item.noOfDays
                                                        )}
                                                    </td>
                                                    <td>
                                                        {tempFields[`${index}-endDate`] || item["endDate"] || "-"}
                                                    </td>
                                                    <td>
                                                        <button  onClick={() => handleSubmit(index, item.uniqKey)}>
                                                            Submit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>)}
                                </React.Fragment>)}
                        </table>
                    </div>
                </div>
            )}
            {currentTab === 'remainder-complete' && (
                <div>
                    <div className='ERP_table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>S.NO</th>
                                    <th>PatientId</th>
                                    <th>PatientName</th>
                                    <th>Mobile</th>
                                    <th>Issue</th>
                                    <th>RemainderTime</th>
                                    <th>NoOfDays</th>
                                    <th>EndDate</th>
                                    <th>IVR Status</th>
                                </tr>
                            </thead>
                            {loading ? <Loader /> : (
                                <React.Fragment>
                                    {completedPatients.length === 0 ? (<tbody>
                                        <tr>
                                            <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                                                No data Found
                                            </td>
                                        </tr>
                                    </tbody>) : (
                                        <tbody>
                                            {completedPatients.map((item, index) => (
                                                <tr key={item.patientId}>
                                                    <td>{index + 1}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.patientId}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.patientName}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.mobile}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.issue}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.remainderTime}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.noOfDays}</td>
                                                    <td onClick={() => view(item.patientId)}>{item.endDate}</td>
                                                    <td >{item.ivrStatus}</td>
                                                </tr>
                                            ))}
                                        </tbody>)}
                                </React.Fragment>)}
                        </table>

                    </div>
                </div>
            )}
            <Dialog open={isOpen} maxWidth="lg">
                <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Patient Details</h2>
                        <span onClick={closeDialog} style={{ cursor: 'pointer', fontSize: '24px' }}>&times;</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            {formdata.uhid && renderField('UHID', formdata.uhid)}
                            {formdata.patientName && renderField('Patient Name', formdata.patientName)}
                            {formdata.mobile && renderField('Mobile', formdata.mobile)}
                            {formdata.datevalue && renderField('Date', formdata.datevalue)}
                            {formdata.department && renderField('Department', formdata.department)}
                            {formdata.gender && renderField('Gender', formdata.gender)}
                            {formdata.dob && renderField('Date of Birth', formdata.dob)}
                        </div>
                        <div style={{ flex: 1 }}>
                            {formdata.doctorName && renderField('Doctor Name', formdata.doctorName)}
                            {formdata.doctorEmail && renderField('Doctor Email', formdata.doctorEmail)}
                            {formdata.doctorId && renderField('Doctor ID', formdata.doctorId)}
                            {formdata.address && renderField('Address', formdata.address)}
                            {formdata.idProofType && renderField('ID Proof Type', formdata.idProofType)}
                            {formdata.bloodGroup && renderField('Blood Group', formdata.bloodGroup)}
                            {formdata.martialStatus && renderField('Marital Status', formdata.martialStatus)}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
export default PerceptionRemainder;