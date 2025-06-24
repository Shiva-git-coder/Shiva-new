import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resources } from '../Resourses/Resourses';
import './RoleCreation.css';
import '../PatientopdScreens/PerceptionRemainder.css';
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from '../ReusableComponent/NavBar';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadIcon from "@mui/icons-material/Upload";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import AuthService from '../LoginSignUpScreens/AuthService';
import { Link, useNavigate, useLocation } from "react-router-dom";

const RoleCreation = () => {
    const [data, setData] = useState([
        { role: '', id: '', phoneNo: '', username: '', email: '', department: '', viewData: [] }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([]);
    const [openRowIndex, setOpenRowIndex] = useState(null);
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newRow, setNewRow] = useState({
        role: '',
        id: '',
        phoneNo: '',
        username: '',
        email: '',
        department: '',
        viewData: [],
    });
    const [disable,setDisable] = useState(false)

    const [editIndex, setEditIndex] = useState(null);


    // const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false); // Renamed state for dialog visibility
    // const [selectedRowIndex, setSelectedRowIndex] = useState(null);  // Renamed state for tracking the selected row

    const [newSlot, setNewSlot] = useState([{
        uniqKey:'',
        date: '',
        availableTimes:''
    }]);

    const [edit,setEdit] = useState(true);

    const handleOpenAdbdSlotDialog = (index) => {
        setSelectedRowIndex(index);  // Track the selected row index
        setIsSlotDialogOpen(true);    // Open the dialog for the selected row
    };

    const closeSlotDialog = () => {
        setIsSlotDialogOpen(false);  // Close the dialog
        setSelectedRowIndex(null);   // Reset the selected row index
    };


    // Open the dialog
    const openAddDialog = () => {
        setIsDialogOpen(true);
    };

    // Close the dialog
    const closeAddDialog = () => {
        setIsDialogOpen(false);
        setNewRow({ role: '', id: '', phoneNo: '', username: '', email: '', department: '', viewData: [] });
    };

    // Handle input change for the new row
    const handleNewRowChange = (e, field) => {
        setNewRow({ ...newRow, [field]: e.target.value });
    };

    // Add the new row to the table
    const handleAddRowToTable = () => {
        setData([newRow, ...data]); 
        setEditIndex(0);
    };


    const navigate = useNavigate();

    const handleFileSelect = (e) => {
        const input = e.target;
        if (input.files.length > 0) {
            setFile(input.files[0]);
        }
    };

    const handleLogout = async () => {
        alert("hello")
        await Cookies.remove("userInfo");
        navigate("/Login");
        window.location.reload();
    };

    const navItems = [
        { label: 'LogOut', onClick: handleLogout, icon: <LogoutIcon /> },
    ];

    const handleReset = (e) => {
        setFile(null);
    };

    const handleAddSlot = (rowIndex) => {
        const updatedData = [...data];

        if (!Array.isArray(updatedData[rowIndex].viewData)) {
            updatedData[rowIndex].viewData = []; // Initialize as an empty array if it's not
        }

        updatedData[rowIndex].viewData.push({
            uniqKey: "",  // Default unique key (you can generate it dynamically)
            date: "",     // Default value for date
            availableTime: []  // Default value for availableTime
        });

        setData(updatedData);
    };

    const handleSlotChange = (rowIndex, slotIndex, value) => {
        const updatedData = [...data];

        // Check if viewData is an array
        if (Array.isArray(updatedData[rowIndex].viewData)) {
            updatedData[rowIndex].viewData[slotIndex].availableTime = value; // Update the availableTime
        } else {
            // If it's not an array, initialize it as an array
            updatedData[rowIndex].viewData = [{ availableTime: value }];
        }

        setData(updatedData);
    };

    const handleOpen = (index) => {
        setOpenRowIndex(index);
    };

    const handleClose = () => {
        setOpenRowIndex(null);
    };

    const handleAddRow = () => {
        setData([...data, { role: '', id: '', phoneNo: '', username: '', email: '', department: '', viewData: [] }]);
    
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChange = (e, index, field) => {
        const updatedData = [...data];
        updatedData[index][field] = e.target.value;
        setData(updatedData);
    };


    const handleSave = async () => {
        // Map through the data and join the availableTime arrays into a string for saving
        const updatedDialogData = data.map(doctor => ({
            ...doctor,
            viewData: doctor.viewData.map(slot => ({
                ...slot,
                // If availableTime is an array, join it into a string for saving
                availableTime: Array.isArray(slot.availableTime)
                    ? slot.availableTime.join(',')  // Join array into string
                    : slot.availableTime           // Keep it as-is if it's already a string
            }))
        }));

        // Update the data state with the modified viewData
        setData(updatedDialogData);
        setEditIndex(null);

        // Attempt to save the updated data
        try {
            await axios.post(`${resources.APPLICATION_URL}save/admin/maintainance/data`, updatedDialogData);
        } catch (e) {
            console.error("Error while saving:", e);
        }
    };

    const handleCancel = () => {
        console.log("Cancelling edit...");
        setEditIndex(null);
    };

    const formatDate = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGetRolesData = async () => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}getallmaintainancedata`);
            setData(res.data);

        } catch (e) {
            console.error("Error fetching role data:", e);
        }
    };

    const getRoles = async () => {
        try {
            const res = await axios.get(`${resources.Authorization_URL}getAllRoles`);
            setRoles(res.data);
        } catch (e) {
            console.error("Error fetching roles:", e);
        }
    };

    useEffect(() => {
        getRoles();
        handleGetRolesData();
    }, []);

    const filteredData = (data || []).filter((row) => {
        return (
            row.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);


    const handleSlotDateChange = (openRowIndex, slotIndex, newDate) => {
        // Update state with the new date
        const updatedData = [...data];
        updatedData[openRowIndex].viewData[slotIndex].date = newDate;
        setData(updatedData);
    };


    const handleSlotTimeChange = (openRowIndex, slotIndex, timeIndex, newTime) => {
        const newData = [...data]; // Make a copy to avoid direct mutation
        const slot = newData[openRowIndex]?.viewData[slotIndex];

        // Ensure availableTime is treated as an array
        const currentTimes = Array.isArray(slot.availableTime)
            ? slot.availableTime
            : (slot.availableTime ? slot.availableTime.split('~') : []);

        console.log("currentTimes===>",currentTimes)

        // Update the specific time in the array
        currentTimes[timeIndex] = newTime;

        // Join the array back into a string and update the slot's availableTime
        slot.availableTime = currentTimes.join('~');

        // Set the updated data state
        setData(newData);
    };


    const handleAddTimeToSlot = (openRowIndex, slotIndex) => {
        const newData = [...data];
        const slot = newData[openRowIndex]?.viewData[slotIndex];

        // Ensure availableTime is initialized as an array
        if (!Array.isArray(slot.availableTime)) {
            slot.availableTime = slot.availableTime
                ? slot.availableTime.split('~')
                : []; // Initialize as an empty array if undefined
        }

        // Add a new empty time field
        slot.availableTime.push('');

        // Update state to trigger re-render
        newData[openRowIndex].viewData[slotIndex] = { ...slot, availableTime: slot.availableTime };
        setData(newData);
    };


    const handleRemoveTime = (rowIndex, slotIndex, timeIndex) => {
        const updatedData = [...data];
        const slot = updatedData[rowIndex]?.viewData[slotIndex];

        // Ensure availableTime is initialized as an array
        const currentTimes = Array.isArray(slot.availableTime)
            ? slot.availableTime
            : (slot.availableTime ? slot.availableTime.split('~') : []);

        // Remove the specified time
        currentTimes.splice(timeIndex, 1);

        // Update the slot's availableTime
        slot.availableTime = currentTimes.join('~');

        // Update the state with the modified data
        setData(updatedData);
    };



    const handleRemoveSlot = (rowIndex, slotIndex) => {
        const updatedData = [...data];
        updatedData[rowIndex].viewData.splice(slotIndex, 1);
        setData(updatedData);
    };


    const handleUploadFile = async () => {
        if (file.length == 0) {
            return;
        }
        const formData = new FormData();
        formData.append("staffFileUpload", file);
        const response = await axios.post(
            `${resources.APPLICATION_URL}uploadStaffDetails?uploadBy=${userId}`,
            formData
        );
        console.log("response", response);

        if (response.data.status == "true") {
            //   message.success(response.data.message);
            //   getAllPanelDetails();
            handleReset();
        } else {
            //   message.error(response.data.message);
            console.log("error", e)
        }
    };

    const fetchUser = async () => {
        const user = await AuthService.getCurrentUSer();
        setUserId(user?.username)
    };


    const handleAddNewTimeSlot = () => {
        setNewSlot((prevState) => ({
            ...prevState,
            availableTimes: [...prevState.availableTimes, '']
        }));
    };

    const handleDeleteTimeSlot = (timeIndex) => {
        const updatedTimes = newSlot.availableTimes.filter((_, index) => index !== timeIndex);
        setNewSlot((prevState) => ({
            ...prevState,
            availableTimes: updatedTimes
        }));
    };

    const handleSaveSlotDetails = () => {
        // Add logic for saving the slot (e.g., to your state or backend)
        console.log("Saving Slot:", newSlot);
        setIsSlotDialogOpen(false); // Close the dialog after saving
    };

   
    // Function to handle adding a new slot (row)
    const handleAddNewSlot = () => {
        setNewSlot(prevState => [
            ...prevState,
            { date: '', availableTimes: '' }
        ]);
    };

    // Function to handle removing a slot by its index
    const handleRemoveSlotTime = (index) => {
        setNewSlot(prevState => prevState.filter((_, i) => i !== index));
    };

    // Function to handle date change for a specific slot
    const handleDateChange = (index, newDate) => {
        setNewSlot(prevState => prevState.map((slot, i) =>
            i === index ? { ...slot, date: newDate } : slot
        ));
    };

    // Function to handle available times change for a specific slot
    const handleTimeChange = (index, newTime) => {
        setNewSlot(prevState => prevState.map((slot, i) =>
            i === index ? { ...slot, availableTimes: newTime } : slot
        ));
    };

    const handleEdit = (row) =>{
        console.log("row--->",JSON.stringify(row))
        setEdit(true);
    }

    useEffect(() => { fetchUser() }, [])

    return (
        <div className="role-creation-container">
            <NavBar brandName="Role Management" navItems={navItems} style={{ backgroundColor: "#00796b" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                {/* Search Input */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <SearchIcon
                        sx={{
                            position: "absolute",
                            left: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888",
                        }}
                    />
                    <input
                        style={{
                            width: "200px",
                            paddingLeft: "30px",
                            boxSizing: "border-box",
                            padding: "8px",
                            fontSize: "14px",
                        }}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by Role/Department"
                    />
                </div>

                <button
                    onClick={handleAddRowToTable}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "rgb(119, 192, 173)",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Add Row
                </button>


                {/* Bulk Upload Section */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* Download Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{
                            textTransform: "capitalize",
                            maxHeight: "45px",
                            backgroundColor: "#4caf50",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            color: "white",
                        }}
                    >
                        <a
                            href={`${resources.APPLICATION_URL}downloadAdminDashTemplate`}
                            style={{
                                textDecoration: "none",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <FileDownloadIcon style={{ fontSize: "18px" }} />
                                <span style={{ fontSize: "16px" }}>Download Template</span>
                            </div>
                        </a>
                    </Button>

                    {/* File Upload Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                            accept=".xlsx,.xls"
                        />

                        {/* Display file selection */}
                        {!file ? (
                            <label
                                htmlFor="file-upload"
                                style={{
                                    backgroundColor: "#f1f1f1",
                                    padding: "12px 20px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    border: "2px dashed #888",
                                }}
                            >
                                <UploadIcon style={{ color: "#4caf50" }} />
                                <span style={{ fontSize: "14px" }}>Choose File</span>
                            </label>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <p style={{ fontSize: "14px", fontWeight: "500" }}>
                                    Selected File: <strong>{file.name}</strong>
                                </p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={handleReset}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#e0e0e0",
                                            color: "#333",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            border: "none",
                                        }}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleUploadFile}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#4caf50",
                                            color: "white",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            border: "none",
                                        }}
                                    >
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Table */}
            {/* <div className="ERP_table">
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>ID</th>
                            <th>Phone No</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => {
                            const originalIndex = indexOfFirstRow + index;
                            return (
                                <tr key={originalIndex}>
                                    <td>
                                        <select
                                            onChange={(e) => handleChange(e, originalIndex, 'role')}
                                            className="input-field"
                                            value={row.role || ""}
                                        >
                                            <option>Please Select</option>
                                            {roles &&
                                                roles
                                                    .filter((each) => each !== "")
                                                    .map((each, i) => (
                                                        <option key={i} value={each}>
                                                            {each}
                                                        </option>
                                                    ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            disabled
                                            value={row.id}
                                            onChange={(e) => handleChange(e, originalIndex, 'id')}
                                            className="input-field"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.phoneNo}
                                            onChange={(e) => handleChange(e, originalIndex, 'phoneNo')}
                                            className="input-field"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.username}
                                            onChange={(e) => handleChange(e, originalIndex, 'username')}
                                            className="input-field"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.email}
                                            onChange={(e) => handleChange(e, originalIndex, 'email')}
                                            className="input-field"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.department}
                                            onChange={(e) => handleChange(e, originalIndex, 'department')}
                                            className="input-field"
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpen(originalIndex)}>View Slots</button>
                                        <button onClick={()=> handleEdit(row,originalIndex)}>Edit</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div> */}

             <div className="ERP_table">
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>ID</th>
                        <th>Phone No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    onChange={(e) => handleChange(e, index, "role")}
                                    className="input-field"
                                    value={row.role || ""}
                                    disabled={editIndex !== index}
                                >
                                    <option>Please Select</option>
                                    {roles &&
                                        roles
                                            .filter((each) => each !== "")
                                            .map((each, i) => (
                                                <option key={i} value={each}>
                                                    {each}
                                                </option>
                                            ))}
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    disabled
                                    value={row.id}
                                    className="input-field"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.phoneNo || ""}
                                    onChange={(e) => handleChange(e, index, "phoneNo")}
                                    className="input-field"
                                    disabled={editIndex !== index}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.username || ""}
                                    onChange={(e) => handleChange(e, index, "username")}
                                    className="input-field"
                                    disabled={editIndex !== index}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.email || ""}
                                    onChange={(e) => handleChange(e, index, "email")}
                                    className="input-field"
                                    disabled={editIndex !== index}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.department || ""}
                                    onChange={(e) => handleChange(e, index, "department")}
                                    className="input-field"
                                    disabled={editIndex !== index}
                                />
                            </td>
                            <td>
                                {editIndex === index ? (
                                    <>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                    <button onClick={() => setEditIndex(index)}>Edit</button>
                                    <button onClick={() => handleOpen(indexOfFirstRow + index)}>View Slots</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

            <div className="pagination-controls">
                <button
                    style={{ backgroundColor: "rgb(119, 192, 173)", color: "white" }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >
                    Prev
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    style={{ backgroundColor: "rgb(119, 192, 173)", color: "white" }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSave} className="add-row-btn" style={{ backgroundColor: "rgb(119, 192, 173)" }}>
                    Save
                </button>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={openRowIndex !== null}
                onClose={handleClose}
            >
                <DialogTitle>Add Slots</DialogTitle>
                <DialogContent>
                    <div className="ERP_table">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
                                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Times</th>
                                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data[openRowIndex]?.viewData) &&

                                    data[openRowIndex]?.viewData.map((slot, slotIndex) => {
                                        // Ensure availableTime is treated as an array, even if it's a string or undefined
                                        const availableTimes = Array.isArray(slot.availableTime)
                                            ? slot.availableTime
                                            : (slot.availableTime ? slot.availableTime.split('~') : []);
                                        
                                        console.log("dataAvailableTimes===>",availableTimes)

                                        return (
                                            <tr key={slotIndex}>
                                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                    <input
                                                        type="date"
                                                        value={slot.date || ""}
                                                        onChange={(e) => handleSlotDateChange(openRowIndex, slotIndex, e.target.value)}
                                                        style={{ padding: "10px", fontSize: "14px", width: "150px" }}
                                                    />
                                                </td>
                                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                        {availableTimes.map((time, timeIndex) => (
                                                            <div key={timeIndex} style={{ display: "flex", marginRight: "10px", marginBottom: "5px" }}>
                                                                <input
                                                                    type="time"
                                                                    value={time || ""}
                                                                    onChange={(e) => handleSlotTimeChange(openRowIndex, slotIndex, timeIndex, e.target.value)}
                                                                    style={{ padding: "10px", fontSize: "14px", width: "150px" }}
                                                                />
                                                                <span
                                                                    style={{ color: "red", cursor: "pointer" }}
                                                                    onClick={() => handleRemoveTime(openRowIndex, slotIndex, timeIndex)}
                                                                >
                                                                    &times;
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                                    <IconButton onClick={() => handleAddTimeToSlot(openRowIndex, slotIndex)} style={{ marginRight: "10px" }}>
                                                        <AddIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleRemoveSlot(openRowIndex, slotIndex)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    })


                                }

                            </tbody>
                        </table>
                    </div>
                    <Button
                        variant="contained"
                        onClick={() => handleAddSlot(openRowIndex)}
                        style={{ marginTop: "10px", backgroundColor: "rgb(119, 192, 173)", color: "white" }}
                    >
                        Add Slots
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default RoleCreation;



// export default RoleCreation;
