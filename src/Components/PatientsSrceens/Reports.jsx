import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resources } from '../Resourses/Resourses';
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

const Reports = () =>{
   const [details,setDetails] = useState([]);

   const getAllDetails = async () =>{
    try{
      const res = await axios.get()
    }
    catch(e){
        console.log("error-->",e)
    }
   }




    return(
        <>
          <div className="ERP_table">
                <table>
                    <thead>
                        <tr>
                            <th>Report Date</th>
                            <th>Issue</th>
                            <th>Doctor</th>
                            <th>Report Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {currentRows.map((row, index) => {
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
                                    </td>
                                </tr>
                            );
                        })} */}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Reports