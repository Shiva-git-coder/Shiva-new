import React, { useState, useEffect } from "react"
import { resources } from "../Resourses/Resourses"
import AuthService from "../LoginSignUpScreens/AuthService"
import axios from "axios"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import Cookies from "js-cookie"


const MyAppointments = () => {
   const [userMail, setUserMail] = useState("");
   const [appDetails, setAppDetails] = useState([]);
   const [editRowId, setEditRowId] = useState(null);
   const [cancelledRowId, setCancelledRowId] = useState(null);
   const [slotsList, setSlotsList] = useState([]);
   const [selectedSlot, setSelectedSlot] = useState("");

   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // Track which appointment to cancel
   const [eachData, setEachData] = useState({});



   useEffect(() => {
      if (userMail) {
         appointmentDetails();
      }
   }, [userMail]);


   const handleEdit = (id, doctorId, patientEmail, dateOfAppointment) => {
      if (editRowId === id) {
         setEditRowId(null);
      } else {
         setEditRowId(id);
         const currentAppointment = appDetails.find((appointment) => appointment.uniqKey === id);
         setSelectedSlot(currentAppointment?.assignedSlot || "");
         getAvailableSlts(doctorId, patientEmail, dateOfAppointment);
      }
   };


   // const handleSlotChange = (id, newSlot) => {
   //    setAppDetails((prevDetails) =>
   //       prevDetails.map((appointment) =>
   //          appointment.uniqKey === id ? { ...appointment, assignedSlot: newSlot } : appointment
   //       )
   //    );
   //    setEditRowId(null);
   // };

   const fetchUser = async () => {
      const user = await AuthService.getCurrentUSer();
      setUserMail(user.email);
   };

   const appointmentDetails = async () => {
      try {
         const res = await axios.get(`${resources.APPLICATION_URL}get/patient/appointments?patientEmail=${userMail}`);
         const updatedAppointments = res?.data?.map((appointment) => ({
            ...appointment,
            assignedSlot: appointment.assignedSlot || "",
         }));
         setAppDetails(updatedAppointments);

      } catch (e) {
         console.error("Error fetching appointments:", e);
      }
   };


   const handleCancel = (id, each) => {
      setSelectedAppointmentId(id);
      console.log("id--->", id)
      setDialogOpen(true);
      // setCancelledRowId(id);
      // confirmCancel(id,each)
      setEachData(each);
   };

   const confirmCancel = async () => {
      // const payload = {
      //    patientAppointments: {
      //       ...eachData,
      //       cancelStatus: "Deactive",
      //    },
      // };
      // console.log("data===>Cancel", JSON.stringify(eachData));

      try {
         const res = await axios.put(
            `${resources.APPLICATION_URL}update/status?uniqueKey=${eachData.uniqKey
            }&cancelStatus=${"Deactive"}`,

         );
         setEditRowId(null);
         setSelectedSlot("");
         setDialogOpen(false);
         appointmentDetails();
      }
      catch (e) {
         console.log("error-->", e)
      }
   };


   const getEditDetails = async (each, id) => {
      try {
         const res = await axios.put(
            `${resources.APPLICATION_URL}update/sepecific/appointment?uniqueId=${id}`,
            appDetails[editRowId],
         );

         console.log("Slot Updated Response:", res.data);
         setEditRowId(null);
         setSelectedSlot("");
         appointmentDetails();
      } catch (e) {
         console.error("Error updating slot:", e);
      }
   };

   const date = new Date();
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();
   const formattedDate = `${day}-${month}-${year}`;


   const getAvailableSlts = (doctorId, patientEmail, dateOfAppointment) => {
      axios.get(`${resources.APPLICATION_URL}getAvailableSlots`, {
         params: {
            patientEmail,
            doctorId: doctorId,
            dateValue: dateOfAppointment
         }
      }).then(response => {
         console.log(response);
         if (Array.isArray(response.data)) {
            setSlotsList(response.data)
         }
      }).catch(error => {
         console.log(error)
      })
   }

   useEffect(() => { fetchUser() }, []);
   useEffect(() => { appointmentDetails() }, [userMail]);

   return (
      <>
         <div className="ERP_table">
            <table>
               <thead>
                  <tr>
                     <th>Date</th>
                     <th>Doctor</th>
                     <th>Department</th>
                     <th>Slot</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               {/* <tbody>
                  {appDetails.map((appointment, ind) => {
                    
                     return (
                        <tr key={appointment?.uniqKey}>
                           <td>{appointment?.dateOfAppointment}</td>
                           <td>{appointment?.doctorName}</td>
                           <td>{appointment?.doctorDept}</td>
                           <td>
                              {editRowId === ind ? (

                                 <select
                                    value={editRowId === appointment?.uniqKey ? selectedSlot : appointment?.assignedSlot}
                                    onChange={(e) => setAppDetails(prev => {
                                       const updated = prev.map((each, index) => {
                                          if (index === ind) {
                                             return (
                                                { ...each, assignedSlot: e.target.value }
                                             );

                                          }
                                          return each
                                       });
                                       return updated;
                                    })}
                                    disabled={isPastAppointment}
                                 >
                                    <option value="">Please Select</option>
                                    {slotsList.map((slot, index) => (
                                       <option key={index} value={slot}>
                                          {slot}
                                       </option>
                                    ))}
                                 </select>

                              ) : (
                                 appointment?.assignedSlot
                              )}
                           </td>
                           <td>
                              {editRowId === ind ? (
                                 <>
                                    <button onClick={() => { setEditRowId(null), getEditDetails(appointment, appointment.uniqKey) }} className="row_btn">Save</button>
                                    <button onClick={() => { setEditRowId(null) }} className="row_btn" style={{ marginLeft: "10px" }}>Cancel</button>
                                 </>
                              ) : (
                                 <>
                                    <button onClick={() => handleEdit(ind, appointment?.doctorId, appointment?.email, appointment?.dateOfAppointment)} className='row_btn' disabled={appointment.cancelStatus == "Deactive"}>Edit</button>
                                    <button onClick={() => handleCancel(ind, appointment)} className='row_btn' style={{ marginLeft: "10px" }} disabled={appointment.cancelStatus == "Deactive"}>Cancel Appointment</button>
                                 </>
                              )}
                           </td>
                        </tr>
                     )
                  })}
               </tbody> */}
               <tbody>
                  {appDetails.map((appointment, ind) => {

                     const convertToDate = (dateString) => {
                        // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD' format
                        const parts = dateString.split('-');
                        // Return the date in 'YYYY-MM-DD' format
                        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
                     };

                     const isPastAppointment = (appointmentDate) => {
                        const strippedAppointmentDate = convertToDate(appointmentDate); // Convert appointment date to Date object
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0); // Strip time from current date

                        // Check if the appointment date is less than the current date
                        return strippedAppointmentDate < currentDate;
                     };
                     const appointmentDate = appointment?.dateOfAppointment;

                     // Check if the appointment date is in the past
                     const isPast = appointmentDate && isPastAppointment(appointmentDate) || appointment.cancelStatus == "Deactive"

                     return (
                        <tr
                           key={appointment?.uniqKey}
                           style={{ backgroundColor: isPast ? "#afa9ab" : "transparent" }} // Optionally change row color if past
                        >
                           <td>{appointment?.dateOfAppointment}</td>
                           <td>{appointment?.doctorName}</td>
                           <td>{appointment?.doctorDept}</td>
                           <td>
                              {editRowId === ind ? (
                                 <select
                                    value={editRowId === appointment?.uniqKey ? selectedSlot : appointment?.assignedSlot}
                                    onChange={(e) => setAppDetails(prev => {
                                       const updated = prev.map((each, index) => {
                                          if (index === ind) {
                                             return { ...each, assignedSlot: e.target.value };
                                          }
                                          return each;
                                       });
                                       return updated;
                                    })}
                                    disabled={isPast} // Disable the select dropdown if the appointment is in the past
                                 >
                                    <option value="">Please Select</option>
                                    {slotsList.map((slot, index) => (
                                       <option key={index} value={slot}>
                                          {slot}
                                       </option>
                                    ))}
                                 </select>
                              ) : (
                                 appointment?.assignedSlot
                              )}
                           </td>
                           <td>
                              {editRowId === ind ? (
                                 <>
                                    <button onClick={() => { setEditRowId(null), getEditDetails(appointment, appointment.uniqKey) }} className="row_btn">Save</button>
                                    <button onClick={() => { setEditRowId(null) }} className="row_btn" style={{ marginLeft: "10px" }}>Cancel</button>
                                 </>
                              ) : (
                                 <>
                                    <button onClick={() => handleEdit(ind, appointment?.doctorId, appointment?.email, appointment?.dateOfAppointment)} className="row_btn" disabled={appointment.cancelStatus === "Deactive" || isPast}>Edit</button>
                                    <button onClick={() => handleCancel(ind, appointment)} className="row_btn" style={{ marginLeft: "10px" }} disabled={appointment.cancelStatus === "Deactive" || isPast}>Cancel Appointment</button>
                                 </>
                              )}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>

            </table>
         </div>

         <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Are you sure you want to cancel this appointment? This action cannot be undone.
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setDialogOpen(false)} color="secondary">
                  No
               </Button>
               <Button onClick={confirmCancel} color="primary" autoFocus>
                  Yes, Cancel
               </Button>
            </DialogActions>
         </Dialog>
      </>
   )
}

export default MyAppointments