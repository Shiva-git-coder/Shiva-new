import React, { useState, useEffect } from "react";
import "./BookAppointment.css";
import axios from "axios";
import { resources } from "../Resourses/Resourses";
import AuthService from "../LoginSignUpScreens/AuthService";
import { toast } from "react-toastify";
import BookAppointement from "../../assets/doctorappoint.png";

const BookAppointment = () => {
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

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    specialty: "",
    doctor: "",
    slot: "",
    remarks: "",
  });

  const [department, setDepartment] = useState([]);
  const [doctorNames, setDoctorNames] = useState([]);
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [slotsList, setSlotsList] = useState([]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = "This field is required.";
      }
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const doctorId = doctorDetails.find(
        (item) => item.username === formData.doctor
      );
      const sendingdata = {
        patientName: formData.patientName,
        email: formData.email,
        phoneNo: formData.phone,
        doctorName: formData.doctor,
        doctorDept: formData.specialty,
        doctorId: doctorId?.id,
        assignedSlot: formData.slot,
        dateOfAppointment: formatDateToDDMMYYYY(formData.date),
        remarks: formData.remarks,
      };
      axios
        .post(`${resources.APPLICATION_URL}savePatientAppointment`, sendingdata)
        .then((response) => {
          if (response.data.status === "true") {
            successMessage(response.data.message);
            setFormData({
              patientName: "",
              email: "",
              phone: "",
              date: "",
              specialty: "",
              doctor: "",
              slot: "",
              remarks: "",
            });
          }
          if (response.data.status === "false") {
            errorMessage(response.data.message);
          }
        })
        .catch((error) => {
          errorMessage("Failed To Book Appointment Try Again");
        });
    }
  };

  useEffect(() => {
    async function getData() {
      let user = await AuthService.getCurrentUSer();
      console.log(user);
      setPatientEmail(user.email);
      setFormData((prevdata) => ({
        ...prevdata,
        patientName: user.name,
        email: user.email,
      }));
    }
    getData();
  }, []);

  const handleDepartments = async () => {
    try {
      const response = await axios.get(
        `${resources.APPLICATION_URL}getDistinctDepartments`
      );
      console.log("response data is==>", response.data);
      const departments = response.data;
      if (Array.isArray(departments)) {
        setDepartment(departments);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  useEffect(() => {
    handleDepartments();
  }, []);

  const getDoctorsDetails = async (department) => {
    try {
      const res = await axios.get(
        `${resources.APPLICATION_URL}getDoctorsOnly?department=${department}`
      );
      const allDocDetails = res.data;
      setDoctorDetails(allDocDetails);
      const doctorNames = res?.data?.map((doctor) => doctor.username);
      setDoctorNames(doctorNames);
      console.log("doctorNames===>", JSON.stringify(doctorNames));
    } catch (e) {
      console.log("error", e);
    }
  };

  function formatDate(dateString) {
    const dateValue = new Date(dateString);

    // Ensure the date is valid
    if (isNaN(dateValue)) {
      return "Invalid Date";
    }

    // Get the day, month, and year
    const day = String(dateValue.getDate()).padStart(2, "0"); // Ensure 2 digits for day
    const month = String(dateValue.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const year = dateValue.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const getAvailableSlts = () => {
    const id = doctorDetails.find((item) => item.username === formData.doctor);
    console.log("doctorIdGetting--->", id);

    axios
      .get(`${resources.APPLICATION_URL}getAvailableSlots`, {
        params: {
          patientEmail,
          doctorId: id?.id,
          dateValue: formatDate(formData.date),
        },
      })
      .then((response) => {
        console.log(response);
        if (Array.isArray(response.data)) {
          setSlotsList(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(formData);
    if (formData.doctor) {
      getAvailableSlts();
    }
  }, [formData.doctor, patientEmail, formData.date]);

  return (
    <>
      <div className="overAll_bookAppointment_wrap">
        <div className="BookAppointment_wallpaper_wrapper"></div>
        <div className="form-container">
          <div className="bg_img_form_container_book">
            {/* <h1>hello</h1> */}
          </div>

          <div className="bookappointment_form_wrap">
            <h2>BOOK AN APPOINTMENT</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    disabled
                    value={formData.patientName}
                    onChange={handleInputChange}
                  />
                  {errors.patientName && (
                    <span className="error">{errors.patientName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone/Mobile</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Date of Appointment</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  {errors.date && <span className="error">{errors.date}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="specialty"
                    value={formData?.specialty}
                    onChange={(e) => {
                      handleInputChange(e);
                      getDoctorsDetails(e.target.value);
                    }}
                  >
                    <option value="">Please Select</option>
                    {department?.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <span className="error">{errors.specialty}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Preferred Doctor</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                  >
                    <option value="">Please Select</option>
                    {doctorNames?.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                  {errors.doctor && (
                    <span className="error">{errors.doctor}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Slot</label>
                  <select
                    name="slot"
                    value={formData.slot}
                    onChange={handleInputChange}
                  >
                    <option value="select">Select</option>
                    {slotsList.map((slot, idx) => (
                      <option value={slot} key={idx}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Medical Condition</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                  />
                  {/* {errors.condition && <span className="error">{errors.condition}</span>} */}
                </div>
                {/* <div className="form-group">
                        <label>Captcha</label>
                        <input
                            type="text"
                            name="captcha"
                            value={formData.captcha}
                            onChange={handleInputChange}
                        />
                        {errors.captcha && <span className="error">{errors.captcha}</span>}
                    </div> */}
              </div>

              <p className="mandatory-note">Fields marked (*) are mandatory</p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ alignItems: "flex-end" }}>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
