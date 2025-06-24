package com.lawyer.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.lawyer.model.PatientAppointments;
import com.lawyer.model.PatientDetails;
import com.lawyer.model.PatientEnquiry;
import com.lawyer.model.PatientFeedbackAnalysis;
import com.lawyer.model.PatientResponse;
import com.lawyer.payload.response.PatientHistory;
import com.lawyer.service.PatientService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1")
public class PatientDetailsController {

	@Autowired
	private PatientService patientDetailsService;

	@Value("${upload}")
	private String UPLOAD_DIR;

	Logger logger = LoggerFactory.getLogger(PatientDetailsController.class);
	ObjectMapper mapper = new ObjectMapper();


	/***
	 * 
	 * @param allparams
	 * @return PatientDetails
	 */

	@GetMapping("/findbyidinfo")
	public ResponseEntity<PatientDetails> patientIdInfor(@RequestParam Map<String, String> allparams) {
		List<PatientDetails> patientDetails = null;
		PatientDetails patientDetailsObject = null;
		try {
			patientDetails = patientDetailsService.fetchingPatient(allparams, UPLOAD_DIR);
			if (patientDetails.size() > 0 && patientDetails != null)
				patientDetailsObject = patientDetails.get(0);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().body(patientDetailsObject);

	}

	/**
	 * 
	 * @param patientdetails
	 * @param image
	 * @return
	 * @throws IOException
	 */

	@PostMapping(value = "/patientRegister", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Object> pinfo(@RequestPart(name="patientdetails") PatientDetails patientdetails,
			@RequestPart(name = "image", required = false) MultipartFile image,
			@RequestParam String receptionistId
			) {
		Object msg = "";
		try {
//			String receptionistId="UID000001";
			logger.info("Received patient details: " + mapper.writeValueAsString(patientdetails));
			msg = patientDetailsService.regpatientlInfo(patientdetails, image, receptionistId);
			logger.info("msag==>"+msg);
			if (msg != null)
				return ResponseEntity.ok().body(msg);
			else
				return ResponseEntity.noContent().build();

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	/**
	 *Delete Patient By Patient Id (UHID)
	 */
	
	@GetMapping("/getAllPatientDetails")
	public ResponseEntity<Object> getAllPatientDetails(@RequestParam String receptionistId,String dateValue) {
		Object msg = "";
		try {
			if (receptionistId.isEmpty())
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);

			if (receptionistId != null)
				msg = patientDetailsService.getAllPatientDetails(receptionistId,dateValue);

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
	 *Update Patient By Patient Id (UHID)
	 */
	
	@PutMapping("/updatePatientDetails")
	public ResponseEntity<Object> updatePatientDetails(@RequestBody PatientDetails patientDetails) {
		Object msg = "";
		try {
			if (patientDetails != null) {
				msg = patientDetailsService.updatePatientDetails(patientDetails);
			}
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
	 *Delete Patient By Patient Id (UHID)
	 */
	
	@DeleteMapping("/deleteByPatientId")
	public ResponseEntity<Object> deleteByPatientId(@RequestParam String patientId) {
		Object msg = "";
		try {
			if (patientId.isEmpty())
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

			msg = patientDetailsService.removeByPatientId(patientId);
			logger.info("Patient Details by Id ~>" + msg);

			if (msg != null)
				return ResponseEntity.status(HttpStatus.OK).body(msg);
			else
				return ResponseEntity.noContent().build();

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
// it is not using
//	@GetMapping("/view")
//	public ResponseEntity<HospitalResponse> viewingInformation() {
//		return patientDetailsService.viewingInformation(UPLOAD_DIR);
//	}
	// order by date values and timestamp values
/**
 * 
 * @param timevalue
 * @return
 */
	@GetMapping("/timestampvalues")
	public ResponseEntity<List<String>> patientTimeInfo(@RequestParam String timevalue) {
		 List<String> patientsByExactTimestamp = patientDetailsService.getPatientsByExactTimestamp(timevalue);
		return ResponseEntity.status(HttpStatus.OK).body(patientsByExactTimestamp);

	}
	/**
	 * 
	 * @return
	 */
	@GetMapping("/getall")
	public ResponseEntity<Iterable<PatientDetails>> getinfo(){
		Iterable<PatientDetails>result=patientDetailsService.getalldetails();
		return ResponseEntity .status(HttpStatus.OK).body(result);

	}
	/**
	 * 
	 */
//	@GetMapping("/getDateTime")
//    public Map<String, String> getDateTime() {
//        Timestamp timestamp = new Timestamp(System.currentTimeMillis()); // example timestamp
//
//        Map<String, String> response = new HashMap<>();
//        response.put("date", TimestampUtils.getDateFromTimestamp(timestamp)); // e.g., "2024-10-28"
//        response.put("time", TimestampUtils.getTimeFromTimestamp(timestamp)); // e.g., "11:11:44"
//
//        return response;
//    }
	@GetMapping("/finddatetime")
	public ResponseEntity<ResponseEntity<Map<String, String>>> getDateTimeInfo(){
		ResponseEntity<Map<String, String>> result= patientDetailsService.getDateTime ;
		return ResponseEntity .status(HttpStatus.OK).body(result);
		
	}
	//for getting all info based on doctor and date
	public ResponseEntity<List<PatientDetails>>findallinfobaseddoctordate(String dateonly,String doctorid){
		List<PatientDetails> result=patientDetailsService.getPatientDetails(dateonly, doctorid);
		return ResponseEntity .status(HttpStatus.OK).body(result);
		
	}
	// for second entity class rest operation
	/**
	 * 
	 * @param patientres
	 * @return
	 */
	@PostMapping("/savesecond")
	public ResponseEntity<String> savepatientresponseinfo(@RequestBody PatientResponse patientres){
		
		String resultresponse=patientDetailsService.patientSecondEntity(patientres);
		return ResponseEntity .status(HttpStatus.OK) .body(resultresponse);
		
	}
	
	/**
	 * for dipalying the patient in Q
	 * 
	 * @param dateval1
	 * @param docid
	 * @return
	 */
	@GetMapping("/getAssignedPatients")
	public ResponseEntity<List<PatientHistory>> getAssignedPatients(@RequestParam String doctorId,
			@RequestParam String currentDate) {
		try {

			if (doctorId.isEmpty() || currentDate.isEmpty())
				return ResponseEntity.badRequest().build();

			logger.info("Doctor Id~>" + doctorId + "Current date~>" + currentDate);
			List<PatientHistory> resultsecond = patientDetailsService.getAssignedPatients(doctorId, currentDate);

				return ResponseEntity.status(HttpStatus.OK).body(resultsecond);

		} catch (Exception e) {
			logger.error("error occured ~>", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	} 
	/**
	 * 
	 * @param doctorid
	 * @return
	 */
	@GetMapping("/allpatients/specificdoctor")
	public ResponseEntity<List<PatientHistory>> getAllpatientsUsingDoctorId(@RequestParam String doctorid){
		List<PatientHistory> allPatientsResult=patientDetailsService.getAllPatientsSpecificDoctor(doctorid);
		return ResponseEntity .status(HttpStatus.OK).body(allPatientsResult);
		
	}
	@GetMapping("/count/specific/daypatients")
	public ResponseEntity<Integer> countspecificDayPatients(@RequestParam String dateval,String doctorid){
		logger.info("call was triggered in count/specific/daypatients dateval"+ dateval+" doctorid"+doctorid);
		int patientsResult=patientDetailsService.countPatientsThisDayList(dateval, doctorid);
		return ResponseEntity.status(HttpStatus.OK).body(patientsResult);
		
	}
	@GetMapping("/totalPatientCountByDoctor")
	public ResponseEntity<Map<String, String>> patientCountBasedOnDoctor(@RequestParam String doctorId) {
		Map<String, String> counts = new HashMap<>();
		try {
			if (doctorId != null)
              
				counts = patientDetailsService.countAllPatientsToSpecificDoctor(doctorId);

			return ResponseEntity.status(HttpStatus.OK).body(counts);

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}
	
	@PutMapping("/updatePatientStatus")
	public ResponseEntity<Object> updatePatientStatus(@RequestParam String patientId) {
		Object result = "";
		try {
			if(patientId!=null)
			result = patientDetailsService.updatedPatientStatus(patientId);
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	/*
	 * CurrentDate completed Patients Based on Current Date
	 */
	
	@GetMapping("/completedPatientsDetails")
	public ResponseEntity<Object> completedPatientsDetails(@RequestParam Map<String, String> allParams) {
		Object result = "";
		try {
			if (allParams != null)
				result = patientDetailsService.completedPatientsDetails(allParams.get("doctorId"), allParams.get("currentDate"));
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	/*
	 * Completed patients History Without Current Date
	 */
	
	@GetMapping("/completedPatientsHistory")
	public ResponseEntity<Object> completedPatientsHistory(@RequestParam Map<String, String> allParams) {
		Object result = "";
		try {
			if (allParams != null)
				result = patientDetailsService.completedPatientsHistory(allParams.get("doctorId"), allParams.get("currentDate"));
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	/*
	 * Completed patients History Based on ReceptionId
	 * Adding Medicine Reminder screen
	 */
	
	@GetMapping("/eligibleForMedicineAnalysis")
	public ResponseEntity<Object> patientsStatusByReceptionist(@RequestParam String receptionistId) {
		Object result = "";
		try {
			if (receptionistId != null)
				result = patientDetailsService.patientsStatusByReceptionist(receptionistId);
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	/*
	 * Saving Patient Enquiry Eligble Patients(Medicine Reminder)
	 */
	
	@PostMapping("/savePatientEnquiryDetails")
	public ResponseEntity<Object> savePatientEnquiryDetails(@RequestBody PatientEnquiry patientDetails) {
		Object result = "";
		try {
			logger.info("Patient Details for ivr ~>" + mapper.writeValueAsString(patientDetails));
			if (patientDetails != null)
				result = patientDetailsService.savePatientIvrDetails(patientDetails);
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	/*
	 * Patient Details Based on Patient Id
	 */
	
	@GetMapping("/patientDetailsById")
	public ResponseEntity<Object> patientDetailsById(@RequestParam String patientId) {
		Object msg = "";
		try {
//			if (patientId != null)
				msg = patientDetailsService.getByPatientId(patientId);
			logger.info("Patient Details by Id ~>" + msg);

			return ResponseEntity.status(HttpStatus.OK).body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	
	/*
	 * Completed patients History Based on ReceptionId
	 * adding to feedback screen
	 */
	
	@GetMapping("/eligibleForFeedbackAnalysis")
	public ResponseEntity<Object> eligibleForFeedback(@RequestParam String receptionistIdno) {
		Object result = "";
		try {
			if (receptionistIdno != null)
				result = patientDetailsService.eligibleForFeedback(receptionistIdno);
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	/*
	 * Saving Patient Feedback Analysis
	 */
	
	@PostMapping("/savePatientFeedbackAnalysis")
	public ResponseEntity<Object> savePatientFeedbackAnalysis(@RequestBody PatientFeedbackAnalysis feedback) {
		Object result = "";
		try {
			logger.info("from front end ~>" + mapper.writeValueAsString(feedback));
			if (feedback != null)
				result = patientDetailsService.savePatientFeedbackAnalysis(feedback);
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	
	/**
	 * Patient Appointment Calls
	 */
	
	@PostMapping("/savePatientAppointment")
	public ResponseEntity<Object> savePatientAppointment(@RequestBody PatientAppointments appointment) {
		Object msg = "";
		try {

			if (appointment == null)
				return ResponseEntity.badRequest().build();

			msg = patientDetailsService.savePatientAppointements(appointment);

			return ResponseEntity.ok().body(msg);

		} catch (Exception e) {
			logger.error("error occured ~>", e);
			return ResponseEntity.internalServerError().body(null);

		}
	}
	
	
	/**
	 * Appointment view for Receptionist
	 */
	
	@GetMapping("/patientAppointmentView")
	public ResponseEntity<Object> getAppointmentView() {
		Object result = "";
		try {
				result = patientDetailsService.getAppointmentView();
			
				return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	/**
	 * Update appointment Status
	 */
	
	@PutMapping("/updateAppointmentStatus")
	public ResponseEntity<Object> updateAppointmentStatus(@RequestParam Map<String, String> params) {
		Object result = "";
		try {
			if (params.isEmpty())
				return ResponseEntity.badRequest().build();

			result = patientDetailsService.updateAppointmentStatus(params.get("uniqKey"),
					params.get("appointmentStatus"));

			return ResponseEntity.status(HttpStatus.OK).body(result);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	//---------------------------------------------------------------------------------------------------------------
	
	
	/**
	 * Patient DashBoard calls
	 */
	
	
	@GetMapping("/getMyReports")
	public ResponseEntity<Object> getMyReports(@RequestParam String patientId) {
		Object result = "";
		try {

			if (patientId.isEmpty())
				return ResponseEntity.badRequest().build();

			result = patientDetailsService.getMyReportsForPatients(patientId);

			logger.info("Final Report for Patient ~>" + mapper.writeValueAsString(result));

			return ResponseEntity.status(HttpStatus.OK).body(result);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PutMapping("/updatepatientfeedback")
	public ResponseEntity<Object> updateFeedBack(@RequestBody PatientFeedbackAnalysis patientFeedbackAnalysisFeedback){
		Object result="";
		
		try {
			
			if(patientFeedbackAnalysisFeedback==null) 
				
			
			return ResponseEntity.badRequest().build();
			
			result=patientDetailsService.updatePatientFeedbackAnalysis(patientFeedbackAnalysisFeedback);
			return ResponseEntity.status(HttpStatus.OK).body(result);
			
			
			
		}
		catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		
	}
	
	@GetMapping("/getpatientfeedback")
	public ResponseEntity<Object> getPatientFeedbackSummery(@RequestBody PatientFeedbackAnalysis patientFeedbackAnalysisFeedback) {
		
		 
		logger.info("patientFeedbackAnalysisFeedback using logger only====>"+patientFeedbackAnalysisFeedback);
	    if (patientFeedbackAnalysisFeedback == null || patientFeedbackAnalysisFeedback.getPatientId() == null) {
	        return ResponseEntity.badRequest().body("Invalid request: Patient feedback data is missing.");
	    }
	    
	    try {
			logger.info("patientFeedbackAnalysisFeedback using logger with mapper====>"+mapper.writeValueAsString(patientFeedbackAnalysisFeedback));

	        Object result = patientDetailsService.getFeedBackSummeryBasedOnIdAndDate(patientFeedbackAnalysisFeedback);
	        return ResponseEntity.status(HttpStatus.OK).body(result);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve feedback summary.");
	    }
	}


	
	
	
}
