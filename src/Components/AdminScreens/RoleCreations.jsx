import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Typography,
} from "@mui/material";
import AuthService from '../LoginSignUpScreens/AuthService';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios';
import { resources } from "../Resourses/Resourses";
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadIcon from "@mui/icons-material/Upload";
import NavBar from '../ReusableComponent/NavBar';
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";


function RoleCreations() {
    const [open, setOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({
        role: "",
        id: "",
        username: "",
        email: "",
        department: "",
        phoneNo: "",
        viewData: [],
    });
    const [editData, setEditData] = useState(null);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading,setLoading] = useState(false);


    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFileSelect = (e) => {
        const input = e.target;
        if (input.files.length > 0) {
            setFile(input.files[0]);
        }
    };

    const handleReset = (e) => {
        setFile(null);
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

        if (response.data) {
            //   message.success(response.data.message);
            handleReset();
            handleGetRolesData();
            successMessage("Uploaded File Successfully!!")
        } else {
            //   message.error(response.data.message);
            errorMessage("Failed To Upload");
        }
    };


    const filteredData = (tableData || []).filter((row) => {
        return (
            row.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleOpenEditDialog = (data) => {
        setEditData(data);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setEditData(null);
        setOpenEditDialog(false);
    };

    const handleInputChange = (e) => {
        console.log("value-->", e)
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRow = () => {
        if (editData) {
            setEditData((prev) => ({
                ...prev,
                viewData: [
                    ...prev.viewData,
                    { uniqKey: "", date: "", availableTime: [""] },
                ],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                viewData: [
                    ...prev.viewData,
                    { uniqKey: "", date: "", availableTime: [""] },
                ],
            }));
        }
    };

    const handleAddTimeOnly = (rowIndex) => {
        if (editData) {
            const updatedViewData = [...editData.viewData];
            updatedViewData[rowIndex].availableTime.push("");
            setEditData((prev) => ({ ...prev, viewData: updatedViewData }));
        } else {
            const updatedViewData = [...formData.viewData];
            updatedViewData[rowIndex].availableTime.push("");
            setFormData((prev) => ({ ...prev, viewData: updatedViewData }));
        }
    };

    const handleDateChange = (rowIndex, value) => {
        const formatDateToDDMMYYYY = (date) => {
            if (!date) return "";
            const [year, month, day] = date.split("-");
            return `${day}-${month}-${year}`;
        };

        const formattedDate = formatDateToDDMMYYYY(value);

        if (editData) {
            const updatedViewData = [...editData.viewData];
            updatedViewData[rowIndex].date = formattedDate;
            setEditData((prev) => ({ ...prev, viewData: updatedViewData }));
        } else {
            const updatedViewData = [...formData.viewData];
            updatedViewData[rowIndex].date = formattedDate;
            setFormData((prev) => ({ ...prev, viewData: updatedViewData }));
        }
    };


    const handleTimeChange = (rowIndex, timeIndex, value) => {
        if (editData) {
            const updatedViewData = [...editData.viewData];
            updatedViewData[rowIndex].availableTime[timeIndex] = value;
            setEditData((prev) => ({ ...prev, viewData: updatedViewData }));
        } else {
            const updatedViewData = [...formData.viewData];
            updatedViewData[rowIndex].availableTime[timeIndex] = value;
            setFormData((prev) => ({ ...prev, viewData: updatedViewData }));
        }
    };


    const handleRemoveTimeField = (rowIndex, timeIndex) => {
        if (editData) {
            const updatedViewData = [...editData.viewData];
            updatedViewData[rowIndex].availableTime.splice(timeIndex, 1);
            setEditData((prev) => ({ ...prev, viewData: updatedViewData }));
        } else {
            const updatedViewData = [...formData.viewData];
            updatedViewData[rowIndex].availableTime.splice(timeIndex, 1);
            setFormData((prev) => ({ ...prev, viewData: updatedViewData }));
        }
    };

    const formatDateReverse = (date) => {
        if (!date) return "";

        if (date.includes("-") && date.split("-")[0].length === 4) {
            return date;
        }

        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = async () => {
        const convertAvailableTime = (times) => {
            if (times.length === 0) return "";
            return times.join("~");
        };

        const formatDateToDDMMYYYY = (date) => {
            if (!date) return "";
            const [year, month, day] = date.split("-");
            return `${day}-${month}-${year}`;
        };


        const updatedViewData =
            formData.viewData.length > 0
                ? formData.viewData.map((row) => ({
                    ...row,
                    date: row.date,
                    availableTime: convertAvailableTime(row.availableTime),
                }))
                : [
                    {
                        uniqKey: "",
                        date: "",
                        availableTime: "",
                    },
                ];

        const updatedFormData = {
            ...formData,
            id: "",
            viewData: updatedViewData,
        };

        setLoading(true);
        try {
            const res = await axios.post(
                `${resources.APPLICATION_URL}save/admin/maintainance/data`,
                [updatedFormData]
            );
            console.log("res.data.status==>",res.data.status);
            if (res.data.status === "true"){
              successMessage(res.data.message);
              handleClose();
            }
            else{
              errorMessage(res.data.message);
            }
            
        } catch (e) {
            console.error("Error while saving:", e);
            handleClose();
            errorMessage("Failed To Save Data!!");
        }
        finally{
          setLoading(false);
        }

        handleGetRolesData();
        setFormData({
            role: "",
            username: "",
            email: "",
            department: "",
            phoneNo: "",
            viewData: [],
        });

    };


    const handleSaveEdit = async () => {
        const convertAvailableTime = (times) => {
            if (times.length === 0) return "";
            return times.join("~");
        };

        const formatDateToDDMMYYYY = (date) => {
            if (!date) return "";
            const [year, month, day] = date.split("-");
            return `${day}-${month}-${year}`;
        };

        const updatedViewData = editData.viewData.map((row) => ({
            ...row,
            date: row.date,
            availableTime: convertAvailableTime(row.availableTime),
        }));

        const updatedFormData = {
            ...editData,
            viewData: updatedViewData,
        };


        try {
            await axios.put(
                `${resources.APPLICATION_URL}updateUserDetails`,
                updatedFormData
            );
            setOpenEditDialog(false);
            successMessage("Data Updated Successfully!!");
        } catch (e) {
            console.error("Error While Saving:", e);
            errorMessage("Failed To Save !!!");
        }

        handleGetRolesData();

        setEditData({
            role: "",
            username: "",
            email: "",
            department: "",
            phoneNo: "",
            viewData: [],
        });

        handleClose();
    };

    const handleGetRolesData = async () => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}getallmaintainancedata`);

            const processedData = res.data.map((item) => ({
                ...item,
                viewData: item.viewData.map((view) => ({
                    ...view,
                    availableTime: view?.availableTime?.split("~"),
                })),
            }));


            setTableData(processedData);
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


    const handleDeleteClick = (row, rowIndex) => {
        setSelectedRow({ row, rowIndex });
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        const { row, rowIndex } = selectedRow;

        try {
            if (row.id) {
                await axios.delete(`${resources.APPLICATION_URL}deleteUserByUid?uId=${row.id}`);
            }
            const updatedRows = tableData.filter((_, index) => index !== rowIndex);
            setTableData(updatedRows);
            console.log(`Row with ID: ${row.id} has been deleted.`);
        } catch (error) {
            console.error("Error while deleting row:", error);
            alert("Failed to delete the row. Please try again.");
        }

        setOpenConfirmDialog(false);
    };


    // const deleteSlot = async (row, rowIndex, isEditing = false) => {
    //     if (isEditing) {
    //         if (row.uniqKey) {
    //             const isConfirmed = window.confirm('Are you sure you want to delete this data? This action cannot be undone.');

    //             if (isConfirmed) {
    //                 try {
    //                     await axios.delete(`${resources.APPLICATION_URL}deleteUserInAdminDash?adminId=${row.uniqKey}`);

    //                     const updatedViewData = editData.viewData.filter((_, index) => index !== rowIndex);
    //                     setEditData((prev) => ({
    //                         ...prev,
    //                         viewData: updatedViewData,
    //                     }));

    //                     handleGetRolesData();
    //                 } catch (error) {
    //                     console.error("Error while deleting slot:", error);
    //                     alert("Failed to delete the slot. Please try again.");
    //                 }
    //             } else {
    //                 console.log("Deletion canceled.");
    //             }
    //         }
    //     } else {
    //         const isConfirmed = window.confirm('Are you sure you want to delete this data? This action cannot be undone.');

    //         if (isConfirmed) {
    //             const updatedViewData = formData.viewData.filter((_, index) => index !== rowIndex);
    //             setFormData((prev) => ({
    //                 ...prev,
    //                 viewData: updatedViewData,
    //             }));
    //         } else {
    //             console.log("Deletion canceled.");
    //         }
    //     }
    // };


    const deleteSlot = async (row, rowIndex, isEditing = false) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this data? This action cannot be undone.');

        if (!isConfirmed) {
            console.log("Deletion canceled.");
            return;
        }

        if (isEditing) {
            // Check if uniqKey exists and proceed with the API call
            if (row.uniqKey) {
                try {
                    await axios.delete(`${resources.APPLICATION_URL}deleteUserInAdminDash?adminId=${row.uniqKey}`);

                    const updatedViewData = editData.viewData.filter((_, index) => index !== rowIndex);
                    setEditData((prev) => ({
                        ...prev,
                        viewData: updatedViewData,
                    }));

                    handleGetRolesData();
                } catch (error) {
                    console.error("Error while deleting slot:", error);
                    alert("Failed to delete the slot. Please try again.");
                }
            } else {
                // Handle case when uniqKey is missing (optional, e.g., logging, fallback)
                console.log("No uniqKey available. Deleting row locally without API call.");

                const updatedViewData = editData.viewData.filter((_, index) => index !== rowIndex);
                setEditData((prev) => ({
                    ...prev,
                    viewData: updatedViewData,
                }));

                // Optionally trigger any additional local logic for non-editing rows
            }
        } else {
            // No API call, just update local state
            const updatedViewData = formData.viewData.filter((_, index) => index !== rowIndex);
            setFormData((prev) => ({
                ...prev,
                viewData: updatedViewData,
            }));
        }
    };


    const fetchUser = async () => {
        const user = await AuthService.getCurrentUSer();
        setUserId(user?.username)
    };

    const handleLogout = async () => {
        await Cookies.remove("userInfo");
        navigate("/Login");
        window.location.reload();
    };


    const navItems = [
        { label: 'LogOut', onClick: handleLogout, icon: <LogoutIcon /> },
    ];

    useEffect(() => { fetchUser() }, [])

    return (
      <div>
        <NavBar
          brandName="Role Management"
                navItems={navItems}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: "8.5em",
                top: "53%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />
            <input
              style={{
                width: "250px",
                paddingLeft: "30px",
                boxSizing: "border-box",
                padding: "15px",
                fontSize: "14px",
                borderRadius: "5em",
                border: "1px solid transparent",
                backgroundColor: "rgb(225 227 221) ",
              }}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by Role/Department"
            />
          </div>

          <button onClick={handleOpen} className="row_btn">
            Add Row
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                textTransform: "capitalize",
                maxHeight: "45px",
                backgroundColor: "#1a73e8",
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <FileDownloadIcon style={{ fontSize: "18px" }} />
                  <span style={{ fontSize: "16px" }}>Download Template</span>
                </div>
              </a>
            </Button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                accept=".xlsx,.xls"
              />

              {!file ? (
                <label
                  htmlFor="file-upload"
                  style={{
                    backgroundColor: "#f1f1f1",
                    padding: "8px 20px",
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
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

        <div className="ERP_table">
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th>Role</th>
                <th>id</th>
                <th>Username</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone No</th>
                <th>Schedule</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.role}</td>
                  <td>{row.id}</td>
                  <td>{row.username}</td>
                  <td>{row.email}</td>
                  <td>{row.department}</td>
                  <td>{row.phoneNo}</td>
                  <td>
                    {row.viewData.map((view, i) => (
                      <div key={i}>
                        <strong>Date:</strong> {view?.date} <br />
                        <strong>Times:</strong> {view?.availableTime?.join(", ")}
                      </div>
                    ))}
                  </td>
                  <td>
                    <IconButton onClick={() => handleOpenEditDialog(row)}>
                      <EditIcon />
                    </IconButton>
                    <button
                      style={{
                        outline: "none",
                        border: "none",
                        marginLeft: "10px",
                      }}
                      onClick={() => {
                        handleDeleteClick(row, index);
                      }}
                    >
                      <IconButton>
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle>
            Add New Row
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <select
                name="role"
                onChange={handleInputChange}
                className="input-field"
                value={formData.role}
                style={{ width: "200px" }}
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
            </div>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                margin="normal"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <TextField
                margin="normal"
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                label="Phone Number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
              />
            </div>

            {formData.role == "ROLE_DOCTOR" && (
              <>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  Add Slots
                </Typography>
                <div className="ERP_table">
                  <table style={{ width: "100%", marginTop: "10px" }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.viewData.map((row, rowIndex) => (
                        <tr key={row.uniqKey}>
                          <td>
                            <TextField
                              type="date"
                              value={formatDateReverse(row.date)}
                              onChange={(e) =>
                                handleDateChange(rowIndex, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <div style={{ display: "flex" }}>
                              {row.availableTime.map((time, timeIndex) => (
                                <div
                                  key={timeIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 8,
                                  }}
                                >
                                  <TextField
                                    type="time"
                                    value={time}
                                    onChange={(e) =>
                                      handleTimeChange(
                                        rowIndex,
                                        timeIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveTimeField(rowIndex, timeIndex)
                                    }
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex" }}>
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddTimeOnly(rowIndex)}
                                variant="text"
                              ></Button>
                              <IconButton
                                onClick={() => deleteSlot(row, rowIndex, false)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  sx={{ marginTop: 2 }}
                  variant="outlined"
                >
                  Add Date and Time Row
                </Button>
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={handleSubmit}>
              {loading ?"Loading...":"Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            Edit Row
            <IconButton
              aria-label="close"
              onClick={handleCloseEditDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <TextField
                margin="normal"
                label="Role"
                name="role"
                value={editData?.role || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                margin="normal"
                label="Username"
                name="username"
                value={editData?.username || ""}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="normal"
                label="Email"
                name="email"
                value={editData?.email || ""}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="normal"
                label="Department"
                name="department"
                value={editData?.department || ""}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="normal"
                label="Phone Number"
                name="phoneNo"
                value={editData?.phoneNo || ""}
                onChange={handleEditInputChange}
              />
            </div>

            {editData?.role == "ROLE_DOCTOR" && (
              <>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  Time Fields
                </Typography>
                <div className="ERP_table">
                  <table style={{ width: "100%", marginTop: "10px" }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editData?.viewData.map((row, rowIndex) => (
                        <tr key={row.uniqKey}>
                          <td>
                            <TextField
                              type="date"
                              value={formatDateReverse(row.date)}
                              onChange={(e) =>
                                handleDateChange(rowIndex, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <div style={{ display: "flex" }}>
                              {row?.availableTime?.map((time, timeIndex) => (
                                <div
                                  key={timeIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 8,
                                  }}
                                >
                                  <TextField
                                    type="time"
                                    value={time}
                                    onChange={(e) =>
                                      handleTimeChange(
                                        rowIndex,
                                        timeIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveTimeField(rowIndex, timeIndex)
                                    }
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex" }}>
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleAddTimeOnly(rowIndex)}
                                variant="text"
                              ></Button>
                              <IconButton
                                onClick={() => deleteSlot(row, rowIndex, true)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  sx={{ marginTop: 2 }}
                  variant="outlined"
                >
                  Add Date and Time Row
                </Button>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleSaveEdit}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this row?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default RoleCreations;
