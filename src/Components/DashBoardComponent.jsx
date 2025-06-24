import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { DateRange, AssignmentInd, People } from "@mui/icons-material";
// import backgroundImage from '../../assets/b8.jpg';
import BackGroundImg from  "../../../src/assets/lawBG.jpg"
// import Svgimg from "../../../src/assets/SvgWave.png"
import Wave from "../../../src/assets/Wave.jpg"
import AuthService from "../LoginSignUpScreens/AuthService";
import axios from "axios";
import { resources } from "../Resourses/Resourses";
import MasksIcon from "@mui/icons-material/Masks";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { Flex } from "antd";
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const getCurrentTime = () => {
  const date = new Date();
  const time = date.getHours();
  if (time >= 5 && time < 12) {
    return "Good Morning";
  } else if (time >= 12 && time < 17) {
    return "Good Afternoon";
  } else if (time >= 17 && time < 19) {
    return "Good Evening";
  } else if (time >= 19 && time < 24) {
    return "Happy Night";
  } else {
    return "Hello";
  }
};
const DashboardComponent = (props) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const [name, setName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const { handleNavigation } = props;
  const [patientCount, setPatientCount] = useState({});
  const [activeCount, setActiveCount] = useState("");
  const [toatalCount, setTotalCount] = useState("");

  console.log("props", props);

  const getTotalPatientsCount = async (doctorId) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}totalPatientCountByDoctor?doctorId=${doctorId}`
      );
      console.log("patientsCount===>", res.data.overallCount);
      console.log(res);
      // setPatientCount(res.data);
      setTotalCount(res?.data?.overallCount);
    } catch (e) {
      console.log("error", e);
    }
  };

  function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}-${month}-${year}`;
  }

  console.log(getCurrentDate());
  const dateValue = getCurrentDate();

  const getActivePatients = async (id) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}count/specific/daypatients?doctorid=${id}&dateval=${dateValue}`
      );
      setActiveCount(res?.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    async function getData() {
      let user = await AuthService.getCurrentUSer();
      console.log(user);
      getTotalPatientsCount(user.doctorId);
      getActivePatients(user.doctorId);
      setName(user?.name);
      setDoctorId(user?.doctorId);
    }
    getData();
  }, []);

  return (
    <Box sx={{padding:1,}}>

      <Box 
        sx={{
      
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // marginTop:"00px"
         
        }}
      >
      
      </Box>

      <Box
        sx={{
          height: 400,
          // backgroundImage: `url(${BackGroundImg})`,
          backgroundImage: `url(${Wave})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 3,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="span"
              sx={{ fontWeight: 800, color: "black", marginBottom: 1 }}
            >
              {getCurrentTime()}
            </Typography>
            <Typography variant="body1" sx={{ color:"black",marginRight: 1 }}>
              {formattedDate}
            </Typography>
          </Typography>
          <Typography variant="h6" sx={{ color: "black", marginBottom: 2 }}>
            <b>Dr.</b> {name}
          </Typography>
          <Typography
            className="custom-text-DashboardDrthanks-fonts"
            variant="body1"
            sx={{ marginBottom: 2 }}
          >
    

<Box sx={{
  display: "flex",
  flexDirection: "column",
 alignItems: "center",
  marginLeft:"600px",
  // textAlign: "center",
  padding: "20px",

}}>
      <Typography sx={{
fontSize: "24px",
fontWeight: "bold",
color: "Black",

      }}>Successful Way</Typography>
      <Typography sx={{
         fontSize: "40px",
         fontWeight: "bold",
         color: "#E35C02",
         marginTop: "8px",
      }}>Best Law Service</Typography>
      <Typography sx={{
          fontSize: "18px",
          color: "Black",
          marginTop: "8px",
      }}>Ready to solve your problems</Typography>
    </Box>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", marginTop: 6 }}>
            <Box
              sx={{
                backgroundColor: "#2ea5ff",
                borderRadius: 2,
                padding: 1.5,
                width: "5%", // Decrease the width of the box
                boxShadow: 6,
                margin: "0 10px", // Space between boxes
              }}
            >
              <MasksIcon Outlined sx={{ color: "black" }} />
            </Box>
            <Typography>
              <Typography sx={{ color: "black" }}>
                <b>{toatalCount ? toatalCount : "0"}</b>
              </Typography>
              <Typography sx={{ color: "black" }} varient="h2">
                Clients
              </Typography>
            </Typography>
            {/* <Box
              sx={{
                backgroundColor: "#99F762",
                borderRadius: 2,
                padding: 1.5,
                width: "5%", // Decrease the width of the box
                boxShadow: 6,
                margin: "0 10px", // Space between boxes
              }}
            >
              <MonitorHeartIcon Outlined sx={{ color: "white" }} />
            </Box>
            <Typography>
              <Typography sx={{ color: "black" }}>
                <b>{toatalCount ? toatalCount : "0"}</b>
              </Typography>
              <Typography sx={{ color: "black" }} varient="h2">
                Surgery
              </Typography>
            </Typography> */}

            {/* <Box
              sx={{
                backgroundColor: "#f48037",
                borderRadius: 2,
                padding: 1.5,
                width: "5%", // Decrease the width of the box
                boxShadow: 6,
                margin: "0 10px", // Space between boxes
              }}
            >
              <DirectionsWalkIcon sx={{ color: "black" }} />
            </Box>
            <Typography>
              <Typography sx={{ color: "black" }}>
                <b>{toatalCount ? toatalCount : "0"}</b>&nbsp;
              </Typography>
              <Typography sx={{ color: "black" }} varient="h2">
                Discharge
              </Typography>
            </Typography> */}
          </Box>

          {/* <Button variant="contained" onClick={() => handleNavigation("Appointments")} color="primary" sx={{ marginTop: 2 }}>
            View My Appointments
          </Button> */}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginTop: 3,
          width: "100%",
          height: "100px",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: 'rgb(92, 240, 248)',
            borderRadius: 2,
            padding: 2,
            height:200,
            background:"rgb(123, 240, 246)",
            width: "30%", // Decrease the width of the box
            boxShadow: 6,
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleNavigation("Appointments")}
            // color="primary"
            sx={{ color:"white", marginTop: 10, background:"rgb(14, 106, 186)", }}
          >
            View My Appointments
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: 'rgb(92, 240, 248)',
            borderRadius: 2,
            padding: 2,
            height:200,
            background:"rgb(123, 240, 246)",
            width: "30%", // Decrease the width of the box
            boxShadow: 6,
            margin: "0 10px", // Space between boxes
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "",marginTop:10,
          }}>
             <Typography sx={{ color: "rgb(8, 8, 8)", fontWeight:600, fontSize:"20px"}}>
             {activeCount}
              </Typography> 
           
            </Typography>
            <Typography variant="body1" sx={{ color: "#000"}}>
              Acitve Patients
            </Typography>
          </Box>
          <Box backgroundColor="white" borderRadius="20px"  textAlign="center" padding="10px" marginTop="80px" >
            <People sx={{ marginRight: 0, color: "#E35B02" }} />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: 'rgb(92, 240, 248)',
            borderRadius: 2,
            padding: 2,
            width: "30%",
              height:200,
              background:"rgb(123, 240, 246)",
            boxShadow: 6,
            margin: "0 10px",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "" ,marginTop:10,
           }}>
                <Typography sx={{ color: "rgb(10, 10, 10)", fontWeight:600, fontSize:"20px"}}>
                {toatalCount ? toatalCount : "0"}
              </Typography> 
           
            </Typography>
            <Typography variant="body1" sx={{ color: "#000" }}>
              Total Patients
            </Typography>
          </Box>
          <Box backgroundColor="white" borderRadius="20px" textAlign="center" padding="10px" marginTop="80px">
            <People sx={{ marginRight: 0, color: "#E35B02" }} />
          </Box>
        </Box>
      </Box>
      
    </Box>
  );
};

export default DashboardComponent;
