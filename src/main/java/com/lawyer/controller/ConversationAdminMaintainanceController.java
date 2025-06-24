package com.lawyer.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.ConversationAdminMaintainance;
import com.lawyer.model.DepartmentsForAIScribe;
import com.lawyer.model.EmployeeMaintanancePayload;
import com.lawyer.model.PatientAppointments;
import com.lawyer.service.ConversationAdminMaintainanceService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1")
public class ConversationAdminMaintainanceController {

	private ObjectMapper mapper = new ObjectMapper();
	private Logger logger = LoggerFactory.getLogger(ConversationAdminMaintainanceController.class);

	@Autowired
	private ConversationAdminMaintainanceService conversationAdminMaintainanceService;

	/**
	 * Saving Admin added users
	 */

	@PostMapping("/save/admin/maintainance/data")
	public ResponseEntity<Object> conversationAdminMaintainanceController(
			@RequestBody List<EmployeeMaintanancePayload> admindata) {
		Object msg = "";
		try {
			msg = conversationAdminMaintainanceService.saveAdminMaintainancedata(admindata);

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Getting all Admin Added details
	 */


	@GetMapping("/getallmaintainancedata")
	public ResponseEntity<List<EmployeeMaintanancePayload>> getallmaintainancedatacontroller() {

		try {
			List<EmployeeMaintanancePayload> result = conversationAdminMaintainanceService.getAllMainatainanceData();

			return ResponseEntity.status(HttpStatus.OK).body(result);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	/**
	 * Getting doctors list only Based on Dept
	 */

	@GetMapping("/getDoctorsOnly")
	public ResponseEntity<List<ConversationAdminMaintainance>> getDoctorsDetails(@RequestParam String department) {
		List<ConversationAdminMaintainance> msg = new ArrayList<>();
		try {
			msg = conversationAdminMaintainanceService.getDoctorsOnly(department);

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Getting all dept's for OBD
	 */

	@GetMapping("/getDistinctDepartments")
	public ResponseEntity<List<String>> getDistinctDepartments() {
		List<String> msg = new ArrayList<>();
		try {
			msg = conversationAdminMaintainanceService.getDepartments();

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Getting all Doctor slots with specific date
	 */

	@GetMapping("/getAvailableSlots")
	public ResponseEntity<List<String>> getAvailableSlots(@RequestParam String patientEmail,
			@RequestParam String doctorId,@RequestParam String dateValue) {
		List<String> msg = new ArrayList<>();
		try {

			if (patientEmail.isEmpty() || doctorId.isEmpty())
				return ResponseEntity.internalServerError().build();

			msg = conversationAdminMaintainanceService.getAvailableSlots(patientEmail, doctorId, dateValue);

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * update admin added details
	 */

	@PutMapping("/updateUserDetails")
	public ResponseEntity<Object> updateUserDetails(@RequestBody EmployeeMaintanancePayload user) {
		Object msg = "";
		try {
			logger.info("updateUserDetailsFrom Fronted ==>" + mapper.writeValueAsString(user));
			msg = conversationAdminMaintainanceService.updateUserDetails(user);

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Delete admin added details by UniqKey
	 */

	@DeleteMapping("/deleteUserInAdminDash")
	public ResponseEntity<Object> removeUser(@RequestParam String adminId) {
		Object msg = "";
		try {
			msg = conversationAdminMaintainanceService.removeUserDetails(adminId);

			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Delete Based on user id -> UID000004/2024
	 */

	@DeleteMapping("/deleteUserByUid")
	public ResponseEntity<Object> deleteUserByUid(@RequestParam String uId) {
		Object msg = "";
		try {
			msg = conversationAdminMaintainanceService.deleteUserByUid(uId);

			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	// ----------------------------------------------------------------------------------------------------------

	/**
	 * Saving Department Details
	 */
	@PostMapping("/saveDepartmentsDetails")
	public ResponseEntity<Object> saveDeptDetails(@RequestBody List<DepartmentsForAIScribe> departments) {
		Object msg = "";
		try {
			if (!departments.isEmpty())
				msg = conversationAdminMaintainanceService.saveDeptDetails(departments);

			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.noContent().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Getting All Departments
	 */

	@GetMapping("/getDepartmentsDetails")
	public ResponseEntity<Object> getDepartments() {
		List<DepartmentsForAIScribe> all = new ArrayList<>();
		try {
			all = conversationAdminMaintainanceService.getDepartmentsForRegistration();
			if (all != null)
				return ResponseEntity.status(HttpStatus.OK).body(all);
			else
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Update Department
	 */

	@PutMapping("/updateDepartment")
	public ResponseEntity<Object> updateDepartment(@RequestBody DepartmentsForAIScribe dept) {
		Object msg = "";
		try {
			msg = conversationAdminMaintainanceService.updateDepartments(dept);
			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	/**
	 * Delete Department by Department Id
	 */

	@DeleteMapping("/deleteDepartment")
	public ResponseEntity<Object> deleteDepartments(@RequestParam String deptId) {
		Object msg = "";
		try {
			msg = conversationAdminMaintainanceService.deleteDeptByID(deptId);
			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}

	}

	// ------------------------------------------------------------------------------------------------------

	/**
	 * Template for Hospital Staff
	 **/

	@GetMapping("/downloadAdminDashTemplate")
	public ResponseEntity<byte[]> downloadTemplate() {
		try {
			byte[] fileContent = conversationAdminMaintainanceService.downloadTemplate();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.setContentDispositionFormData("attachment", "User_Details.xlsx");

			return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Upload Hospital Staff
	 */

	@PostMapping("/uploadStaffDetails")
	public ResponseEntity<Object> employeeDataExcelUpload(
			@RequestPart(name = "staffFileUpload") MultipartFile excelFile,
			@RequestParam(name = "uploadBy") String adminId) {
		Object sendMessage = "";
		try {

			logger.info("call trigred uploadStaffDetails===>" + adminId);
			sendMessage = conversationAdminMaintainanceService.uploadEmployeeDetailsFile(excelFile, adminId);

			if (sendMessage != null)
				return ResponseEntity.status(HttpStatus.OK).body(sendMessage);
			else
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(sendMessage);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(sendMessage);
		}
	}

	@GetMapping("/get/patient/appointments")
	public ResponseEntity<List<PatientAppointments>> getPatientAppointments(@RequestParam String patientEmail) {

		List<PatientAppointments> appointmentsResult = new ArrayList<>();
		try {
			appointmentsResult = conversationAdminMaintainanceService.getPatientAppointmentsService(patientEmail);
			return ResponseEntity.status(HttpStatus.OK).body(appointmentsResult);

		} catch (Exception e) {
			// TODO: handle exception
			e.getMessage();
			return null;
		}
	}

	/**
	 * update specific appointment
	 * 
	 * @param uniqueId
	 * @param patientAppointments
	 * @return
	 */

	@PutMapping("/update/sepecific/appointment")
	public ResponseEntity<PatientAppointments> updateSpecificPatientAppointment(@RequestParam Long uniqueId,
			@RequestBody PatientAppointments patientAppointments) {

		PatientAppointments appointmentData = null;
		try {
			logger.info("uniqueId====>" + uniqueId);
			logger.info("patientAppointments===>" + mapper.writeValueAsString(patientAppointments));

			appointmentData = conversationAdminMaintainanceService.updatePatientAppointment(uniqueId,
					patientAppointments);
			return ResponseEntity.status(HttpStatus.OK).body(appointmentData);

		} catch (Exception e) {
			// TODO: handle exception
			e.getMessage();
			return null;
		}
	}

	/**
	 * 
	 * @param uniqueid
	 * @param patientAppointments
	 * @return
	 */
	@PutMapping("/update/status")
	public ResponseEntity<PatientAppointments> updateStatusForCancelOperation(
			@RequestParam Map<String, String> allParms) {
		PatientAppointments patientAppointmentsObject = null;
		try {

			logger.info("call was triggered update the status ==>" + allParms);
			patientAppointmentsObject = conversationAdminMaintainanceService.updateStatusForCancel(allParms);
			return ResponseEntity.status(HttpStatus.OK).body(patientAppointmentsObject);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

}
