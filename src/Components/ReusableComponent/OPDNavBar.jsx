import React, { useState ,useEffect} from "react";
import { AppBar, Toolbar, Box, Tabs, Tab, Typography, IconButton ,Tooltip} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PatientRegistrationForm from "../PatientopdScreens/Patient";
import PerceptionRemainder from "../PatientopdScreens/PerceptionRemainder";
import FeedbackAnalysis from "../PatientopdScreens/FeedbackAnalysis";
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import OnlineApplication from "../PatientopdScreens/OnlineApplication";


const NavBar = () => {
    
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "patient-details"; 
    const [currentTab, setCurrentTab] = useState(initialTab);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        navigate(`?tab=${newValue}`, { replace: true });
    };
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const activeTab = queryParams.get("tab");
        if (activeTab) {
            setCurrentTab(activeTab);
        }
    }, [location.search]);
    

      const handleLogout = async () => {
              await Cookies.remove("userInfo");
              navigate("/Login");
              window.location.reload();
          };
    
    return (
        <div>
           <AppBar position="static" sx={{ backgroundColor: "#00796B", padding: "0 10px", maxHeight: "60px" }}>
    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Tabs aligned to the left */}
        <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "20px", // Adjust this value for positioning
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#fffff", 
                height: "3px",
              },
            }}
          >
            <Tab
              value="online-appointment"
              label="Online Appointment"
              sx={{
                margin: "0px 5px",
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "16px",
                color: currentTab === "online-appointment" ? "white" : "white",
                borderRadius: "8px 8px 0 0",
                backgroundColor:
                  currentTab === "online-appointment" ? "" : "transparent",
                "&.Mui-selected": {
                  color: "white",
                  borderBottom: "3px solid #fffff",
                },
                "&:hover": {
                  color:
                    currentTab === "online-appointment" ? "black" : "black",
                  backgroundColor: "white",
                },
              }}
            />
            <Tab
              value="patient-details"
              label="Patient Details"
              sx={{
                margin: "0px 5px",
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "16px",
                color: currentTab === "patient-details" ? "white" : "white",
                borderRadius: "8px 8px 0 0",
                backgroundColor:
                  currentTab === "patient-details" ? "" : "transparent",
                "&.Mui-selected": {
                  color: "white",
                  borderBottom: "3px solid red",
                },
                "&:hover": {
                  color: currentTab === "patient-details" ? "black" : "black",
                  backgroundColor: "white",
                },
              }}
            />
            <Tab
              value="preception-remainder"
              label="Prescription Reminder"
              sx={{
                margin: "0px 5px",
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "16px",
                color:
                  currentTab === "preception-remainder" ? "white" : "white",
                borderRadius: "8px 8px 0 0",
                backgroundColor:
                  currentTab === "preception-remainder" ? "#" : "transparent",
                "&.Mui-selected": {
                  color: "white",
                  borderBottom: "3px solid #FFfff",
                },
                "&:hover": {
                  color:
                    currentTab === "preception-remainder" ? "black" : "black",
                  backgroundColor: "white",
                },
              }}
            />
            <Tab
              value="feedback-analysis"
              label="Feedback Analysis"
              sx={{
                margin: "0px 5px",
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "16px",
                color: currentTab === "feedback-analysis" ? "white" : "white",
                borderRadius: "8px 8px 0 0",
                backgroundColor:
                  currentTab === "feedback-analysis" ? "#" : "transparent",
                "&.Mui-selected": {
                  color: "white",
                  borderBottom: "3px solid #FFfff ",
                },
                "&:hover": {
                  color: currentTab === "feedback-analysis" ? "black" : "black",
                  backgroundColor: "white",
                },
              }}
            />
            
        </Tabs>

        {/* Logout button aligned to the right */}
        <Tooltip title="Logout" arrow>
            <IconButton
                color="inherit"
                sx={{ marginLeft: "auto" }}
                onClick={handleLogout}
            >
                <LogoutIcon />
            </IconButton>
        </Tooltip>

    </Toolbar>
</AppBar>

            <div>
                {currentTab === 'patient-details' && <PatientRegistrationForm />}
                {currentTab === 'preception-remainder' && (
                    <PerceptionRemainder />
                )}
                {currentTab === 'feedback-analysis' && (
                    <FeedbackAnalysis />
                )}
                 {currentTab === 'online-appointment' && (
                    <OnlineApplication />
                )}
            </div>
        </div>
    );
};

export default NavBar;
