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
import { Dashboard, AppRegistration, People, Menu } from '@mui/icons-material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthService from '../LoginSignUpScreens/AuthService';
import Cookies from "js-cookie";
import { useNavigate, useLocation } from 'react-router-dom';
import BookAppointment from './BookAppointment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FeedbackAnalysis from './FeedbackAnalysis';
import Remainder from './Remainder';
import MyReports from './MyReports';
// import MyAppointments from './MyAppointments';
import Event from '@mui/icons-material/Event';
import MyAppointments from './MyAppointments';

const AllPatientDashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState('Book Appointment');
    const [doctorDetails, setDoctorDetails] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        navigate("/");
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
        <Box sx={{ display: 'flex', backgroundColor: 'white' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: isCollapsed ? 70 : 270,
                    flexShrink: 0,
                }}
            >
                <Box >
                    {/* Menu icon moved to the right */}
                    <IconButton
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        sx={{ textAlign: 'end', margin: 1, marginLeft: 'auto', marginRight: 1 }}
                    >
                        <Menu sx={{marginLeft:"0.3em",color:"black"}} />
                    </IconButton>
                    {!isCollapsed && (
                        <Box sx={{ padding: 2, textAlign: 'center' }}>
                            <Avatar sx={{ width: 60, height: 60, margin: 'auto' }} />
                            <Typography variant="h6" sx={{ marginTop: 1 }}>
                                {doctorDetails?.name || "John Doe"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                {doctorDetails?.email}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Divider />
        <List>
          <Tooltip
            title="Book Appointment"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("Book Appointment")}
              className="selectedListItem"
            >
              <ListItemIcon>
                <Dashboard
                  style={{
                    color:
                      selectedComponent === "Book Appointment"
                        ? "blue"
                        : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="Book Appointment"
                />
              )}
            </ListItem>
          </Tooltip>

          <Tooltip
            title="My Appointments"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("My Appointments")}
              className="selectedListItem"
            >
              <ListItemIcon>
                <Event
                  className="allpatientIconsColor"
                  style={{
                    color:
                      selectedComponent === "My Appointments"
                        ? "blue"
                        : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="My Appointments"
                />
              )}
            </ListItem>
          </Tooltip>

          <Tooltip
            title="My Reports"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("My Reports")}
              className="selectedListItem"
            >
              <ListItemIcon>
                <SummarizeIcon
                  className="allpatientIconsColor"
                  style={{
                    color:
                      selectedComponent === "My Reports" ? "blue" : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="My Reports"
                />
              )}
            </ListItem>
          </Tooltip>

          <Tooltip
            title="Remainder"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("Remainder")}
              className="selectedListItem"
            >
              <ListItemIcon>
                <ScheduleIcon
                  className="allpatientIconsColor"
                  style={{
                    color: selectedComponent === "Remainder" ? "blue" : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="Remainder"
                />
              )}
            </ListItem>
          </Tooltip>

          <Tooltip
            title="Feedback Analysis"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation("Feedback Analysis")}
              className="selectedListItem"
            >
              <ListItemIcon>
                <FeedbackIcon
                  className="allpatientIconsColor"
                  style={{
                    color:
                      selectedComponent === "Feedback Analysis"
                        ? "blue"
                        : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="Feedback Analysis"
                />
              )}
            </ListItem>
          </Tooltip>

          <Tooltip
            title="Logout"
            arrow
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={handleLogout}
              className="selectedListItem"
            >
              <ListItemIcon>
                <LogoutIcon
                  className="allpatientIconsColor"
                  style={{
                    color:
                      selectedComponent === "handleLogout" ? "blue" : "black",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  className="allpatientIconsColor"
                  primary="Logout"
                />
              )}
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>



            <Box sx={{ flexGrow: 1, padding: 3 }}>
                {selectedComponent === 'Book Appointment' && <BookAppointment />}
                {selectedComponent === 'My Appointments' && <MyAppointments />}
                {selectedComponent === 'My Reports' && <MyReports />}
                {selectedComponent === 'Remainder' && <Remainder />}
                {selectedComponent === 'Feedback Analysis' && < FeedbackAnalysis />}

            </Box>
        </Box>
    );
};

export default AllPatientDashboard;
