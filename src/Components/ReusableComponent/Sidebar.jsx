import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { Dashboard, AppRegistration, People, Menu, Person } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

import DashboardComponent from '../HospitalAiSribe/DashBoardComponent';
import PatientRegistrationForm from "../PatientopdScreens/Patient";

import Conversation from '../Conversation/Conversation';
import MyPatients from '../HospitalAiSribe/MyPaitents';
import AuthService from '../LoginSignUpScreens/AuthService';
import Cookies from "js-cookie";
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');
  const [doctorDetails, setDoctorDetails] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get query param to determine selected component
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const component = params.get('component');
    if (component) {
      setSelectedComponent(component);
    }
  }, [location]);

  const handleNavigation = (component) => {
    setSelectedComponent(component);
    navigate(`?component=${component}`);
    if (!isCollapsed) {
      setIsCollapsed(true); // Collapse the sidebar if it is open
    }
  };

  const handleLogout = async () => {
    await Cookies.remove("userInfo");
    navigate("/Login");
    window.location.reload();
  };

  useEffect(() => {
    async function getUser() {
      const user = await AuthService.getCurrentUSer();
      setDoctorDetails(user);
    }
    getUser();
  }, []);

  return (
    <Box sx={{ display: "flex", backgroundColor: "rgb(251, 252, 252)" }}>
      <Drawer
      
        variant="permanent"
        sx={{
         
          width: isCollapsed ? 70 : 270,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 70 : 270,
            boxSizing: "border-box",
            // paddingTop: 1,
            transition: "width 0.3s",
          },
        }}
      >
        <Box sx={{background: "rgb(207, 246, 248)",color:"black"}}>
          {/* Menu icon moved to the right */}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={
              {
               
                // textAlign: "end",
                // margin: 1,
            //     // marginLeft: "auto",
            //        backgroundColor: 'rgb(92, 240, 248)',
            // borderRadius: 2,
            // padding: 2,
            // height:200,
            // background:"rgb(123, 240, 246)",
                // marginRight: 1.5,
              
              }
            }
          >
            <Menu sx={{ color: "#000", marginLeft: 1 }} />
          </IconButton>
          {!isCollapsed && (
            <Box sx={{ padding: 2, textAlign: "center"}}>
              <Avatar sx={{ width: 60, height: 60, margin: "auto" }} />
              <Typography variant="h6" sx={{ marginTop: 1 }}>
                {doctorDetails?.name || "John Doe"}
              </Typography>
              <Typography variant="body2" sx={{ color: "Black" }}>
                {doctorDetails?.email}
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />
        <List >
          {/* Dashboard */}
          <Tooltip
            title="Dashboard"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("Dashboard")}
              sx={{
                bgcolor:
                  selectedComponent === "Dashboard"
                    ? "CFF9F7"
                    : "CFF9F7",
                color:
                  selectedComponent === "Dashboard"
                    ? "black"
                    : "black",
                "&:hover": {
                  bgcolor: "rgb(134, 246, 242)",
                  color: "Black",
                },
              }}
            >
              <ListItemIcon>
                <Dashboard sx={{ color: "#000" }} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 900,
                    },
                  }}
                  primary="Dashboard"
                />
              )}
            </ListItem>
          </Tooltip>
          <Tooltip 
            title="Add Client"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem 
              button
              sx={{
                bgcolor:
                selectedComponent === "patient-details"
                ? "CFF9F7"
                : "CFF9F7",
              color:
                selectedComponent === "patient-details"
                ? "black"
                : "black",
              "&:hover": {
                bgcolor: "rgb(134, 246, 242)",
                color: "Black",
              },
              }}
              onClick={() => handleNavigation("patient-details")}
            >
              <ListItemIcon>
                <Person sx={{ color: "black" }} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 900,
                    },
                  }}
                  primary="Add Client"
                />
              )}
            </ListItem>
          </Tooltip>


          {/* My Appointments */}
          <Tooltip
            title="My Appointments"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              sx={{
                bgcolor:
                  selectedComponent === "My Appointments"
                    ? "CFF9F7"
                    : "CFF9F7",
                color:
                  selectedComponent === "My Appointments"
                    ? "black"
                    : "black",
                "&:hover": {
                  bgcolor: "rgb(134, 246, 242)",
                  color: "Black",
                },
              }}
              onClick={() => handleNavigation("Appointments")}
            >
              <ListItemIcon>
                <AppRegistration sx={{ color: "#000" }} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 900,
                    },
                  }}
                  primary="My Appointments"
                />
              )}
            </ListItem>
          </Tooltip>

          {/* My Patients */}
          <Tooltip
            title="My Patients"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              sx={{
                bgcolor:
                selectedComponent === "My Patients"
                  ? "CFF9F7"
                  : "CFF9F7",
              color:
                selectedComponent === "My Patients"
                  ? "black"
                  : "black",
              "&:hover": {
                bgcolor: "rgb(134, 246, 242)",
                color: "Black",
              },
              }}
              onClick={() => handleNavigation("My Patients")}
            >
              <ListItemIcon>
                <People sx={{ color: "#000" }} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 900,
                    },
                  }}
                  primary="My Patients"
                />
              )}
            </ListItem>
          </Tooltip>

          {/* Logout */}
          <Tooltip
            title="Logout"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem button onClick={handleLogout}
             sx={{
              bgcolor:
              selectedComponent === "Logout"
                ? "CFF9F7"
                : "CFF9F7",
            color:
              selectedComponent === "Logout"
                ? "black"
                : "black",
            "&:hover": {
              bgcolor: "rgb(134, 246, 242)",
              color: "Black",
            },
              
             }}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 900,
                      
                     
                    },
                  }}
                  primary="Logout"
                />
              )}
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {selectedComponent === "Dashboard" && (
          <DashboardComponent handleNavigation={handleNavigation} />
        )}
        {selectedComponent === "patient-details" && <PatientRegistrationForm />}
        {selectedComponent === "Appointments" && <Conversation />}
        {selectedComponent === "My Patients" && <MyPatients />}
      </Box>
    </Box>
  );
};

export default Sidebar;
