import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../ReusableComponent/Loader";
import "./PerceptionRemainder.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { resources } from "../Resourses/Resourses";

function OnlineApplication() {
    const navigate = useNavigate();
    const location = useLocation();

    const formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

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

    const [patientsData, setPatientsData] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [movedPatients, setMovedPatients] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get("page")) || 1;
        const search = params.get("search") || "";
        setCurrentPage(page);
        setSearchTerm(search);
    }, [location.search]);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${resources.APPLICATION_URL}patientAppointmentView`)
            .then((response) => {
                const patients = response.data.map((patient) => ({
                    ...patient,
                    isEditable: !patient.appointmentStatus, // Editable only if status is empty
                    actionCompleted: false, // Ensure action state
                }));
                setPatientsData(patients);
                setFilteredPatients(patients);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleStatusChange = (uniqKey, status) => {
        const updatedPatients = filteredPatients.map((patient) =>
            patient.uniqKey === uniqKey
                ? { ...patient, appointmentStatus: status, isEditable: true }
                : patient
        );
        setFilteredPatients(updatedPatients);
    };

    const handleAction = (uniqKey) => {
        const patient = filteredPatients.find((p) => p.uniqKey === uniqKey);
        if (!patient || !patient.appointmentStatus) {
            errorMessage("Patient not found or status is empty.");
            return;
        }

        setIsUpdating(true);

        axios
            .put(
                `${resources.APPLICATION_URL}updateAppointmentStatus`,
                {},
                {
                    params: {
                        uniqKey: patient.uniqKey,
                        appointmentStatus: patient.appointmentStatus,
                    },
                }
            )
            .then((response) => {
                successMessage("Status updated successfully.");

                const updatedPatients = filteredPatients.map((p) =>
                    p.uniqKey === uniqKey
                        ? { ...p, actionCompleted: true, isEditable: false }
                        : p
                );
                setFilteredPatients(updatedPatients);

                if (patient.appointmentStatus === "Arrived") {
                    setMovedPatients([...movedPatients, patient]);

                    const sendingData = {
                        uhid: patient.uhid,
                        patientName: patient.patientName,
                        datevalue: patient.dateOfAppointment,
                        department: patient.doctorDept,
                        mobile: patient.phoneNo,
                        email: patient.email,
                        doctorName: patient.doctorName,
                        remarks: patient.remarks,
                        slot: patient.assignedSlot,
                    };

                    navigate("?tab=patient-details", {
                        replace: true,
                        state: { patientData: sendingData },
                    });
                } else if (patient.appointmentStatus === "NotArrived") {
                    successMessage(`Submitted ${patient.patientName}`);
                }
            })
            .catch((error) => {
                console.error(error);
                errorMessage("Failed to update appointment status. Please try again.");
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = patientsData.filter((patient) =>
            patient.patientName.toLowerCase().includes(searchValue)
        );
        setFilteredPatients(filtered);

        const params = new URLSearchParams(location.search);
        params.set("search", searchValue);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set("page", newPage);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const filteredAndSortedPatients = [...filteredPatients]
    .filter((patient) => {
        if (searchTerm) {
            return patient.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true; 
    })
    .sort((a, b) => {
        const parseDate = (date) => {
            if (!date) return new Date(0); 
            const parts = date.split("-");
            if (parts.length === 3) {
                return parts[0].length === 4 
                    ? new Date(date)
                    : new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            return new Date(0); 
        };
        
        const dateA = parseDate(a.dateOfAppointment);
        const dateB = parseDate(b.dateOfAppointment);

        if (!a.appointmentStatus && b.appointmentStatus) return -1; 
        if (a.appointmentStatus && !b.appointmentStatus) return 1;  
        if (a.appointmentStatus && b.appointmentStatus) {
            if (a.appointmentStatus !== b.appointmentStatus) {
                return a.appointmentStatus.localeCompare(b.appointmentStatus); 
            }
        }
        return dateB - dateA; 
    });



    const totalItems = filteredAndSortedPatients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = filteredAndSortedPatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="remainder-container">
            <h2 className="page_title">Online Appointments</h2>
            <Box className="remainder-tabcontainer">
                <input
                    type="text"
                    className="remainder-searchinput"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by patient name"
                />
            </Box>

            <div>
                <div className="ERP_table">
                    <table>
                        <thead>
                            <tr>
                                <th>S.NO</th>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Assigned Slot</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Doctor Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <Loader />
                        ) : (
                            <tbody>
                                {currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((item, index) => (
                                        <tr key={item.uniqKey}>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>{item.patientName}</td>
                                            <td>{item.dateOfAppointment}</td>
                                            <td>{item.assignedSlot}</td>
                                            <td>{item.phoneNo}</td>
                                            <td>{item.email}</td>
                                            <td>{item.doctorDept}</td>
                                            <td>{item.doctorName}</td>
                                            <td>
                                                <select
                                                    value={item.appointmentStatus}
                                                    onChange={(e) =>
                                                        handleStatusChange(item.uniqKey, e.target.value)
                                                    }
                                                    disabled={!item.isEditable}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Arrived">Arrived</option>
                                                    <option value="NotArrived">Not Arrived</option>
                                                </select>
                                            </td>
                                            <td>
                                                {!item.actionCompleted && item.appointmentStatus ? (
                                                    <button
                                                        onClick={() => handleAction(item.uniqKey)}
                                                        disabled={isUpdating}
                                                        style={{
                                                            backgroundColor: "#00796B",
                                                            color: "white",
                                                            padding: "5px 4px",
                                                            border: "none",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {isUpdating ? "Updating..." : "Submit"}
                                                    </button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {currentItems.length > 0 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                        style={{ backgroundColor: "#00796B", color: "white" }}
                    >
                        Prev
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={{ backgroundColor: "#00796B", color: "white" }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default OnlineApplication;
