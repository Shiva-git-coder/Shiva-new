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
import CloseIcon from '@mui/icons-material/Close';

const MyReports = () => {
    const [details, setDetails] = useState([]);
    const [userId, setUserId] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const getAllDetails = async () => {
        try {
            const res = await axios.get(`${resources.APPLICATION_URL}getMyReports?patientId=${userId}`);
            if (Array.isArray(res.data)) {
                setDetails(res?.data);
            } 
        }
        catch (e) {
            console.log("error-->", e)
        }
    }

    const fetchUser = async () => {
        const user = await AuthService.getCurrentUSer();
        setUserId(user?.doctorId);
    };

    console.log("userId==>", userId);

    useEffect(() => { fetchUser() }, []);

    useEffect(() => { getAllDetails() }, [userId])


    const handlePrint = (conversation) => {
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Conversation History</h2>
                <p><strong>Case Identification Information:</strong> ${conversation.case_identification_information}</p>
                <p><strong>Conversation Overview:</strong> ${conversation.conversation_overview}</p>
                <p><strong>Client's Objectives:</strong> ${conversation.clients_objectives}</p>
                <p><strong>Facts of the Case:</strong> ${conversation.facts_of_the_case}</p>
                <p><strong>Legal Issues Identified:</strong> ${conversation.legal_issues_identified}</p>
                <p><strong>Relevant Legal Precedents or Laws:</strong> ${conversation.relevant_legal_precedents_or_laws}</p>
                <p><strong>Evidence Mentioned:</strong> ${conversation.evidence_mentioned}</p>
                <p><strong>Legal Advice Given:</strong> ${conversation.legal_advice_given}</p>
                <p><strong>Next Steps/Action Plan:</strong> ${conversation.next_steps_action_plan}</p>
                <p><strong>Client’s Questions or Concerns:</strong> ${conversation.clients_questions_or_concerns}</p>
                <p><strong>Financial Considerations:</strong> ${conversation.financial_considerations}</p>
                <p><strong>Risks and Challenges:</strong> ${conversation.risks_and_challenges}</p>
                <p><strong>Follow-Up Actions:</strong> ${conversation.follow_up_actions}</p>
                <p><strong>Final Notes and Observations:</strong> ${conversation.final_notes_and_observations}</p>
            </div>
        `;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };


    const handleOpenDialog = (conversation) => {
        setSelectedConversation(conversation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedConversation(null);
    };


    return (
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
                        {details.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.reportDate}</td>
                                <td>{detail.issue}</td>
                                <td>{detail.doctorName}</td>
                                <td>{detail.reportName}</td>
                                <td>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(detail.conversationHistory)}>
                                        View
                                    </Button>
                                    <Button variant="outlined" onClick={() => handlePrint(detail.conversationHistory)} sx={{marginLeft:"10px"}}>
                                        Print
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="lg"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            width: '80%', 
                            maxWidth: '1200px', // Set maxWidth to control the dialog's size
                            borderRadius: '10px', // Rounded corners for the dialog
                            padding: '20px', // Padding around the content
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontSize: '24px', // Larger font size for the title
                        fontWeight: 'bold', // Bold title
                        color: '#333', // Dark text color
                        padding: '16px 24px', // Custom padding for title
                        position: 'relative', // To place the close icon
                    }}>
                        Conversation History
                       
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleCloseDialog}
                            aria-label="close"
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: '#333', 
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{
                        padding: '20px 24px', // Padding around the dialog content
                        maxHeight: '70vh', // Limit the height of the content
                        overflowY: 'auto', // Allow scrolling if content exceeds max height
                    }}>
                        {selectedConversation && (
                            <div>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong> Case Identification Information:</strong> {selectedConversation.case_identification_information}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Conversation Overview:</strong> {selectedConversation.conversation_overview}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Client's Objectives:</strong> {selectedConversation.clients_objectives}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Facts of the Case:</strong> {selectedConversation.facts_of_the_case}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Legal Issues Identified :</strong> {selectedConversation.legal_issues_identified}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Relevant Legal Precedents or Laws:</strong> {selectedConversation.relevant_legal_precedents_or_laws}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Evidence Mentioned:</strong> {selectedConversation.evidence_mentioned}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Legal Advice Given:</strong> {selectedConversation.legal_advice_given}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Next Steps/Action Plan:</strong> {selectedConversation.next_steps_action_plan}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Client’s Questions or Concerns:</strong> {selectedConversation.clients_questions_or_concerns}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Financial Considerations:</strong> {selectedConversation.financial_considerations}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Risks and Challenges:</strong> {selectedConversation.risks_and_challenges}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Follow-Up Actions:</strong> {selectedConversation.follow_up_actions}
                                </p>
                                <p style={{ fontSize: '16px', marginBottom: '12px', color: '#555' }}>
                                    <strong>Final Notes and Observations:</strong> {selectedConversation.final_notes_and_observations}
                                </p>
                            </div>
                        )}
                    </DialogContent>

                </Dialog>

            </div>
        </>
    )
}

export default MyReports