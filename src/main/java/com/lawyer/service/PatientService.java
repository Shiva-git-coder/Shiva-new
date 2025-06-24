package com.lawyer.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.catalina.startup.Tomcat.ExistingStandardWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.constants.Imageconversion;
import com.lawyer.constants.TimestampUtils;
import com.lawyer.helpers.DateFormatterHelper;
import com.lawyer.model.ConversationAdminMaintainance;
import com.lawyer.model.ConversationSummery;
import com.lawyer.model.PatientAppointments;
import com.lawyer.model.PatientDetails;
import com.lawyer.model.PatientEnquiry;
import com.lawyer.model.PatientFeedbackAnalysis;
import com.lawyer.model.PatientFeedbackAnalysisChild;
import com.lawyer.model.PatientResponse;
import com.lawyer.payload.request.MyReportPayload;
import com.lawyer.payload.response.PatientHistory;
import com.lawyer.payload.response.ResponseObject;
import com.lawyer.repository.ConversationAdminMaintainanceRepository;
import com.lawyer.repository.ConversationRepository;
import com.lawyer.repository.PatientAppointmentsRepo;
import com.lawyer.repository.PatientEnquiryRepo;
import com.lawyer.repository.PatientFeedbackAnalysisRepo;
import com.lawyer.repository.PatientRepository;
import com.lawyer.repository.patientResponseRepository;


@Service
public class PatientService {
	
	
	@Value("${upload}")
	private String uploadFielPath;
	
	public static final ResponseEntity<Map<String, String>> getDateTime = null;
	ObjectMapper mapper=new ObjectMapper();
	
	private Logger logger = LoggerFactory.getLogger(PatientService.class);

	@Autowired
	private PatientRepository patientDetailsRepo;

	// for second repository
	@Autowired
	private patientResponseRepository patientResponseRepo;

	@Autowired
	private ConversationRepository convoRepo;
	
	@Autowired
	private PatientEnquiryRepo patientEnquiryRepo;
	
	@Autowired
	private PatientFeedbackAnalysisRepo patientFeedbackAnalysisRepo;

	Imageconversion imageconversion = new Imageconversion();
	
	@Autowired
	private PatientAppointmentsRepo patientAppointmentsRepo;
	
	@Autowired
	private ConversationAdminMaintainanceRepository adminMaintainanceRepository;
//	
//	@Autowired
//	private AIService aiService;
	

	// for save and image
	/**
	 * 
	 * @param patientData
	 * @param image
	 * @param Upload_Dir
	 * @return
	 */
	public ResponseObject regpatientlInfo(PatientDetails patientData, MultipartFile image, String recId) {

		ResponseObject response = new ResponseObject();
		PatientResponse patientStatus = new PatientResponse();
		try {
//			DateTimeFormatter outputformatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//			DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

			DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");

			logger.info("front front end~>" + mapper.writeValueAsString(patientData));

			Path uploadPath = Paths.get(uploadFielPath);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			if (image != null) {
				String finalImage = imageconversion.imageConversion(image, uploadFielPath);
				logger.info("Image Path ~>" + finalImage);

				if (!finalImage.isEmpty())
					patientData.setImage(finalImage);
			}
			// Generating UHID
			String generatedUHID = generateUHID(patientData);
			logger.info("Generated UHID ~>" + generatedUHID);
			if (!generatedUHID.isEmpty())
				patientData.setUhid(generatedUHID);

			// Date Formatting
			String datevalue = patientData.getDatevalue();
			logger.info("datevalue ~>" + datevalue);
			String assignedDate = DateFormatterHelper.convertDate(datevalue);
			if (!assignedDate.isEmpty()) {
				patientStatus.setDate(assignedDate);
				patientData.setDatevalue(assignedDate);
			}

			patientData.setUploadDate(LocalDateTime.now().format(dateTimeFormatter));
			patientData.setReceptionistId(recId);

			// setting Doctor patient Mapping
			patientStatus.setDoctorId(patientData.getDoctorId());
			patientStatus.setPatientEmail(patientData.getEmail());
			patientStatus.setPatientId(patientData.getUhid());
			patientStatus.setReceptionistId(recId);
			patientStatus.setStatus("Progress");
			patientStatus.setCurrentDate(LocalDateTime.now().format(dateTimeFormatter));

			// updating Id to patient(Online)

			boolean existedOrNot = patientAppointmentsRepo.existedOrNot(patientData.getEmail());

			logger.info("Patient exists or not in appointments ~>" + existedOrNot);
			if (existedOrNot) {
				if (!generatedUHID.isEmpty() && !patientData.getEmail().isEmpty()) {
					int updateUHid = patientAppointmentsRepo.updateUHid(generatedUHID, patientData.getEmail(),
							assignedDate);
					if (updateUHid > 0)
						logger.info("UHID Successfully Updated..");
				}
			}

			patientDetailsRepo.save(patientData);
			patientResponseRepo.save(patientStatus);

			response.setStatus("true");
			response.setMessage("Patient Registered Successfully.");
			logger.info("Patient Registered Successfully.");
//			return response;

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus("false");
			response.setMessage("Failed to save.");
			return response;
		}
		return response;

	}
	
	/*
	 * Generating Patient Id
	 */

	private String generateUHID(PatientDetails details) {

		String lastUHID = patientDetailsRepo.getLastUhidNumber();

		logger.info("Getting Latest UHID ~>" + lastUHID);
		if (lastUHID != null && !lastUHID.isEmpty()) {

			if (details.getUhid() == null || details.getUhid().isEmpty()) {

				logger.info("studentId from frontend in==> " + details.getUhid());

				String numericPart = lastUHID.substring(2);// len=6 -> 000010 (0,5)

				logger.info("numericPart==> " + numericPart);

				String[] parts = numericPart.split("/");

				String onlyNumber = parts[0];

				Long numbers = Long.valueOf(onlyNumber); // 6
				logger.info("numbers==> " + numbers);

				String convertedString = String.valueOf(++numbers); // 7
				logger.info("convertedString==> " + convertedString);

				String newUHID = "UH" + numericPart.substring(0, onlyNumber.length() - convertedString.length())
						+ convertedString + "/" + LocalDate.now().getYear(); // 6-1 (0,5)
				logger.info("new UHID Number==> " + newUHID);
				return newUHID;
			}
		} else {
			// for the first time
			int year = LocalDate.now().getYear();
			String newUHID = "UH000001" + "/" + year;
			return newUHID;
		}

		return null;
	}

	/**
	 * 
	 * @param patientuhid
	 * @param upload_directory
	 * @return
	 */
	public List<PatientDetails> fetchingPatient(Map<String, String> patientuhid, String upload_directory) {
		List<PatientDetails> listPatientDetails = new ArrayList<>();
		List<PatientDetails> returnPatientDetails = new ArrayList<>();

		try {
			listPatientDetails = patientDetailsRepo.findAll();
			returnPatientDetails = listPatientDetails.stream()
					.filter(eachPatient -> eachPatient.getUhid().equalsIgnoreCase(patientuhid.get("uhid"))
							|| eachPatient.getMobile().equalsIgnoreCase(patientuhid.get("mobile"))
							|| eachPatient.getIdNumber().equalsIgnoreCase(patientuhid.get("idNumber"))
							|| eachPatient.getPatientName().equalsIgnoreCase(patientuhid.get("patientName")))
					.collect(Collectors.toList());

			String image2 = returnPatientDetails.stream()
					.filter(each -> each.getUhid().equalsIgnoreCase(patientuhid.get("uhid"))
							|| each.getMobile().equalsIgnoreCase(patientuhid.get("mobile"))
							|| each.getIdNumber().equalsIgnoreCase(patientuhid.get("idNumber"))
							|| each.getPatientName().equalsIgnoreCase(patientuhid.get("patientName")))
					.findFirst().map(PatientDetails::getImage).orElse(null);

			Map<String, String> imageurl = new HashMap<>();
			String base64 = null;
			if (image2 != null) {
				base64 = imageconversion.imagetoBase64(upload_directory, image2);
				imageurl.put("image", base64);
			} else {
				imageurl.put("image", "image not found");
			}

			returnPatientDetails.get(0).setImage(base64);
			// System.out.println("imageurl"+imageurl);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return returnPatientDetails;
	}

	public List<String> getPatientsByExactTimestamp(String dateString) {

		List<String> dates = new ArrayList<>();

		List<PatientDetails> byExactTimestamp = patientDetailsRepo.findByExactTimestamp(dateString);
		byExactTimestamp.stream().forEach(each -> {

			String value = String.valueOf(each.getDatevalue());
			dates.add(value.substring(0, 10) + "," + each.getDoctorName());
			System.out.println("Each value is ====> " + value.substring(0, 10) + "," + each.getDoctorName());

		});

		return null;
	}
	// for getby id

	public Iterable<PatientDetails> getalldetails() {
		logger.info("succesfully got the data");
		return patientDetailsRepo.findAll();

	}

	public Map<String, String> getDateTime() {
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());
		Map<String, String> getResponse = new HashMap<>();
		getResponse.put("date", TimestampUtils.getDateFromTimestamp(timestamp));
		getResponse.put("time", TimestampUtils.getTimeFromTimestamp(timestamp));
		return getResponse;

	}

	// get all inform based on doctor and date
	public List<PatientDetails> getPatientDetails(String dateonly, String doctorid) {
		return patientDetailsRepo.getPatientInfoBasedDateDoctor(dateonly, doctorid);
	}

	public String patientSecondEntity(PatientResponse presponse) {

		patientResponseRepo.save(presponse);
		return "sucessfully stored";

	}

	/***
	 * 
	 * @param dateval1
	 * @param doctorids
	 * @return
	 */
	public List<PatientHistory> getAssignedPatients(String doctorEmail, String currentDate) {
		try {
			
			List<PatientResponse> assignedPatients = patientResponseRepo.getPatientBasedOnCurrentDate(doctorEmail,
					currentDate);

			logger.info("patient response ~>" + mapper.writeValueAsString(assignedPatients));

			List<PatientHistory> lphs = assignedPatients.stream().map(e -> {
//				String[] data = patientdata.split(",");
//				String uhid = data[0];
//				String patientName = data[1];
//				String dob = data.length > 2 ? data[2] : null;

//				newly adding code
				String uniqueid = e.getId().toString();

				//
				String patientId = e.getPatientId();
				logger.info("patientId===>" + patientId);
				PatientDetails patientDetails = patientDetailsRepo.getByPatientId(patientId);

				String patientName = patientDetails.getPatientName();
				logger.info("patientName======>" + patientName);
				String dob = patientDetails.getDob();

				// newly adding code
				String recptionistIdNumber = patientDetails.getReceptionistId();

//
//				List<ConversationSummery> lcs = convoRepo.findByPatientId(patientId);

				PatientHistory ph = new PatientHistory();
				ph.setPatientName(patientName);
				ph.setUhid(patientId);
				ph.setDob(dob);
//				ph.setHistory(lcs != null && !lcs.isEmpty());
				ph.setAssignDate(patientDetails.getDatevalue());

				// newly adding code
				ph.setRecptionistIdNumber(recptionistIdNumber);
//
				try {
//					logger.info("Patient History ~>" + mapper.writeValueAsString(lcs));
					logger.info("Patient History ~>" + mapper.writeValueAsString(ph));
				} catch (JsonProcessingException e1) {
					e1.printStackTrace();
				}

				return ph;

			}).collect(Collectors.toList());
			logger.info("Conversation Summery~>" + mapper.writeValueAsString(lphs));
			return lphs;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * for all patients based on doctor id in coversersation summary related method
	 * @param doctorid
	 * @return
	 */
	public List<PatientHistory> getAllPatientsSpecificDoctor(String doctorid){
		List<String> listOfpatients=patientResponseRepo.getAllPatientsByDoctorId(doctorid);
		try {
			System.out.println("list of patients is==>"+mapper.writeValueAsString(doctorid));
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		List<PatientHistory> lphs = listOfpatients.stream().map(patientdata -> {
			String[] data = patientdata.split(",");
			String uhid = data[0];
			String patientName = data[1];
			String dob = data.length > 2 ? data[2] : null;
			
			List<ConversationSummery> lcs = convoRepo.findByPatientId(uhid);
			try {
				System.out.println("uhid===>"+mapper.writeValueAsString(uhid));
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace(); 
			}
			PatientHistory ph = new PatientHistory();
			ph.setPatientName(patientName);
			ph.setUhid(uhid);
			ph.setDob(dob);
			ph.setHistory(lcs != null && !lcs.isEmpty());
			return ph;

		}).collect(Collectors.toList());
		
		return lphs;
		
		
	}
	/**
	 * count this day patients 
	 * @param dateval1
	 * @param doctorids
	 * @return
	 */
	public int countPatientsThisDayList(String dateval1,String doctorids ) {
		
		int thisDayPatientCount=patientResponseRepo.countNumberOfPatientsThisDay(dateval1, doctorids);
		return thisDayPatientCount;
		
	}
	/**
	 * count all patients to specific doctor
	 * @param doctorid
	 * @return
	 */
	public Map<String, String> countAllPatientsToSpecificDoctor(String doctorid) {

		Map<String, String> counts = new HashMap<>();
		try {
			Integer allPatientsCountByDoctor = patientResponseRepo.countNumberOfPatientsOverall(doctorid);
			Integer progressPatientsCount = patientResponseRepo.progressPatientsCount(doctorid);

			if (allPatientsCountByDoctor > 0) {
				logger.info("Total Patients count to doctor~>" + allPatientsCountByDoctor);
				counts.put("overallCount", String.valueOf(allPatientsCountByDoctor));
			}

			if (progressPatientsCount > 0) {
				logger.info("Total Progress count to doctor~>" + progressPatientsCount);
				counts.put("activeCount", String.valueOf(progressPatientsCount));
			}

			logger.info("Counts Map ~>" + mapper.writeValueAsString(counts));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return counts;

	}
	/**
	 * for mark as completed 
	 * @param id
	 * @return
	 */
	public ResponseObject updatedPatientStatus(String patientId) {
		ResponseObject response = new ResponseObject();
		try {
			logger.info("Patient Id ~>" + patientId);
			boolean existedOrNot = patientResponseRepo.getPatientById(patientId);
			logger.info("Patient existed or not ~>" + mapper.writeValueAsString(existedOrNot));

			if (existedOrNot) {
				logger.info("entered inside if");
				int updatePatientStatus = patientResponseRepo.updatePatientStatus("Completed", patientId);
				if (updatePatientStatus > 0) {
					response.setStatus("true");
					response.setMessage("Successfully completed.");
					logger.info("Successfully completed.");
				}
			} else {
				response.setStatus("false");
				response.setMessage("Failed to update");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return response;

	}

	public Object completedPatientsDetails(String doctorId, String currentDate) {
		List<PatientHistory> tillNow = new ArrayList<>();
		try {
			if (doctorId != null && currentDate != null) {

				List<PatientResponse> completedPatientsByDate = patientResponseRepo.getCompletedPatientsByDate(doctorId,
						currentDate, "Completed");

				logger.info("Completed Patients based on Current Date ~>"
						+ mapper.writeValueAsString(completedPatientsByDate));

				completedPatientsByDate.forEach(p -> {
					PatientDetails byPatientId = patientDetailsRepo.getByPatientId(p.getPatientId());
					PatientHistory patient = new PatientHistory();
					patient.setDob(byPatientId.getDob());
					patient.setUhid(p.getPatientId());
					patient.setPatientName(byPatientId.getPatientName());
					patient.setAssignDate(currentDate);
					patient.setHistory(false);
					tillNow.add(patient);
				});
				if (!tillNow.isEmpty()) {

					List<PatientHistory> latestOnTop = tillNow.stream()
							.sorted(Comparator.comparing(PatientHistory::getUhid).reversed())
							.collect(Collectors.toList());
					logger.info("Descending order Patinet History ~>" + mapper.writeValueAsString(latestOnTop));
					return latestOnTop;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	
	public Object completedPatientsHistory(String doctorId, String currentDate) {
		List<PatientHistory> withoutCurrent = new ArrayList<>();
		try {
			if (doctorId != null && currentDate != null) {

				List<PatientResponse> completedPatientsByPastDates = patientResponseRepo
						.patientsHistoryWithoutCurrent(doctorId, currentDate, "Completed");

				logger.info("Completed Patients without Current Date ~>"
						+ mapper.writeValueAsString(completedPatientsByPastDates));

				completedPatientsByPastDates.forEach(p -> {
					PatientDetails byPatientId = patientDetailsRepo.getByPatientId(p.getPatientId());
					PatientHistory patient = new PatientHistory();
					patient.setDob(byPatientId.getDob());
					patient.setUhid(p.getPatientId());
					patient.setPatientName(byPatientId.getPatientName());
					patient.setHistory(false);
					patient.setAssignDate(currentDate);
					withoutCurrent.add(patient);
				});

				if (!withoutCurrent.isEmpty()) {
					List<PatientHistory> descOrder = withoutCurrent.stream()
							.sorted(Comparator.comparing(PatientHistory::getUhid).reversed())
							.collect(Collectors.toList());
					logger.info("collect ~>" + mapper.writeValueAsString(descOrder));
					return descOrder;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public Object patientsStatusByReceptionist(String receptionistId) {

		List<PatientEnquiry> medicineReminder = new ArrayList<>();
		try {

			logger.info("Receptionist Id ~>" + receptionistId);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

			List<PatientResponse> completedPatientsList = patientResponseRepo.getCompletedPatientsList(receptionistId);

			logger.info("Completed patient Details ~>" + mapper.writeValueAsString(completedPatientsList));

			completedPatientsList.forEach(p -> {
				String patientId = p.getPatientId();
				logger.info("Patient ID ~>" + patientId);
				if (patientId != null) {
					boolean checkPatient = patientEnquiryRepo.existingPatientOrNot(patientId);
					logger.info("checkPatient existed status ~>" + checkPatient);
					
					if (!checkPatient) {
						PatientDetails byPatientId = patientDetailsRepo.getByPatientId(patientId);
						if (byPatientId != null) {
							PatientEnquiry ivrData = new PatientEnquiry();
							ivrData.setPatientId(p.getPatientId());
							ivrData.setPatientName(byPatientId.getPatientName());
							ivrData.setMobile(byPatientId.getMobile());
							ivrData.setReceptionistId(p.getReceptionistId());
							ivrData.setIvrStatus("In Progress");
							ivrData.setUploadDate(LocalDate.now().format(formatter));
							medicineReminder.add(ivrData);
						}
					}
				}
			});

			if (medicineReminder != null) {
				logger.info("saving datai for medicine reminder ~>" + mapper.writeValueAsString(medicineReminder));
				patientEnquiryRepo.saveAll(medicineReminder);
				List<PatientEnquiry> byReceptionistId = patientEnquiryRepo.getByReceptionistId(receptionistId);
				logger.info("Getting ivr status by Receptionist Id ~>" + mapper.writeValueAsString(byReceptionistId));
				if (!byReceptionistId.isEmpty())
					return byReceptionistId;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public Object savePatientIvrDetails(PatientEnquiry patientDetails) {
		ResponseObject response = new ResponseObject();
		try {
			if (patientDetails != null) {
				Optional<PatientEnquiry> byId = patientEnquiryRepo.getPatientById(patientDetails.getPatientId());
				if (byId.isPresent()) {
					PatientEnquiry existing = byId.get();
					logger.info("existing~>"+mapper.writeValueAsString(existing));
					existing.setEndDate(patientDetails.getEndDate());
					existing.setNoOfDays(patientDetails.getNoOfDays());
					existing.setRemainderTime(patientDetails.getRemainderTime());
					logger.info("existing for saving~>"+mapper.writeValueAsString(existing));
					patientEnquiryRepo.save(existing);
					response.setStatus("true");
					response.setMessage("Saved SuccessFully.");
				} else {
					response.setStatus("false");
					response.setMessage("Failed to save.");
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus("false");
			response.setMessage("Failed to save.");

		}

		return response;
	}

	public Object getByPatientId(String patientId) {
		try {
			logger.info("Patient Id from front end ~>" + patientId);
			PatientDetails patientById = patientDetailsRepo.getByPatientId(patientId);

//			if (patientById != null) {
				logger.info("Patient Id from front end ~>" + patientById);

				return patientById;
//			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

//	public Object savePatientFeedbackAnalysis(PatientFeedbackAnalysis feedback) {
//		ResponseObject response = new ResponseObject();
//		logger.info("front end data in service====>"+feedback);
//		List<PatientFeedbackAnalysisChild> childEntries=null;
//		try {
//			if (feedback != null) {
//				Optional<PatientFeedbackAnalysis> byId = patientFeedbackAnalysisRepo
//						.getPatientById(feedback.getPatientId());
//				logger.info("byId====>"+mapper.writeValueAsString(byId));
//				if (byId.isPresent()) {
//					PatientFeedbackAnalysis existing = byId.get();
//					logger.info("Patient Feedback Analysis ~>" + mapper.writeValueAsString(existing));
//					existing.setEndDate(feedback.getEndDate());
//					existing.setNoOfDays(feedback.getNoOfDays());
//					existing.setRemainderTime(feedback.getRemainderTime());
//					existing.setFeedback(feedback.getFeedback());
//					
//					
//					//for child class data
//					PatientFeedbackAnalysisChild patientFeedbackAnalysisChildObject=new PatientFeedbackAnalysisChild();
//					int noOfDaysCount=Integer.parseInt(feedback.getNoOfDays().toString());
//					LocalDate curreDate=LocalDate.now();
//					logger.info("curreDate===>"+curreDate.toString());
//					for(int i=0;i<noOfDaysCount;i++) {
//						patientFeedbackAnalysisChildObject.setUniId(UUID.randomUUID().toString());
//
//						patientFeedbackAnalysisChildObject.setDates(curreDate.plusDays(i).toString());
//						patientFeedbackAnalysisChildObject.setIvrStatus("pending");
//						childEntries.add(patientFeedbackAnalysisChildObject);
//						logger.info("childEntries===>"+childEntries);
//							
//					}
//					existing.setPatientFeedbackAnalysisChild(childEntries);
//					logger.info("existing====>"+mapper.writeValueAsString(existing));
//					
//					// Sending analysis to AI
//					
////					Object sendFeedbackToAI = aiService.sendFeedbackToAI(existing);
//					patientFeedbackAnalysisRepo.save(existing);
//					response.setStatus("true");
//					response.setMessage("Saved SuccessFully.");
//				} else {
//					response.setStatus("false");
//					response.setMessage("Failed to save.");
//				}
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			response.setStatus("false");
//			response.setMessage("Failed to save.");
//
//		}
//		return response;
//	}
	
	
	public Object savePatientFeedbackAnalysis(PatientFeedbackAnalysis feedback) {
	    ResponseObject response = new ResponseObject();
	    logger.info("Front end data in service: " + feedback);
	    
	    List<PatientFeedbackAnalysisChild> childEntries = new ArrayList<>();  // Initialize the list properly

	    try {
	        if (feedback != null) {
	            Optional<PatientFeedbackAnalysis> byId = patientFeedbackAnalysisRepo.getPatientById(feedback.getPatientId());
//	            logger.info("byId: " + mapper.writeValueAsString(byId));
	            
	            PatientFeedbackAnalysis existing = byId.orElse(feedback);  // Use existing or new object if not present

	            if (byId.isPresent()) {
	                logger.info("Updating existing Patient Feedback Analysis: " + mapper.writeValueAsString(existing));
	                existing.setEndDate(feedback.getEndDate());
	                existing.setNoOfDays(feedback.getNoOfDays());
	                existing.setRemainderTime(feedback.getRemainderTime());
//	                existing.setFeedback(feedback.getFeedback());
	            } else {
	                logger.info("Creating new Patient Feedback Analysis.");
	            }

	            // Create child class data
	            int noOfDaysCount = Integer.parseInt(feedback.getNoOfDays());
	            LocalDate currentDate = LocalDate.now();
	            
	            logger.info("Current Date: " + currentDate);

	            LocalDate endDate =LocalDate.parse(feedback.getEndDate());
	            logger.info("endDate====>"+endDate);
	            for (int i=0 ; i < noOfDaysCount; i++) {
	                PatientFeedbackAnalysisChild patientFeedbackAnalysisChildObject = new PatientFeedbackAnalysisChild();
	               
	                patientFeedbackAnalysisChildObject.setDates(endDate.minusDays(i).toString());
	                patientFeedbackAnalysisChildObject.setIvrStatus("pending");
	                patientFeedbackAnalysisChildObject.setUploadDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
	                childEntries.add(patientFeedbackAnalysisChildObject);  // Add the new object to the listdd
	            }

	            existing.setPatientFeedbackAnalysisChild(childEntries);
	            logger.info("Updated Patient Feedback Analysis with children: " + mapper.writeValueAsString(existing));
	            
	            patientFeedbackAnalysisRepo.save(existing);  // Save the entity with child entries
	            response.setStatus("true");
	            response.setMessage("Saved Successfully.");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        response.setStatus("false");
	        response.setMessage("Failed to save.");
	    }
	    return response;
	}


	
	
	public Object eligibleForFeedback(String receptionistId) {

		List<PatientFeedbackAnalysis> patientFeedback = new ArrayList<>();
		try {

			logger.info("Receptionist Id ~>" + receptionistId);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

			List<PatientResponse> completedPatientsList = patientResponseRepo.getCompletedPatientsList(receptionistId);

			logger.info("Completed patient Details ~>" + mapper.writeValueAsString(completedPatientsList));

			completedPatientsList.forEach(p -> {
				String patientId = p.getPatientId();
				
				
				logger.info("Patient ID ~>" + patientId);
				if (patientId != null) {
					

				
						ConversationSummery conversationSummeryObject=convoRepo.getPatientLatestRecord(patientId);
						
						logger.info("conversationSummeryObject=====>"+conversationSummeryObject);
						
						String time=conversationSummeryObject.getConversationDate().toString();
						logger.info("time====>"+time);
						
						boolean existingTimeorNot=patientFeedbackAnalysisRepo.existingTimeOrNot(time);
						logger.info("existingTimeorNot=====>"+existingTimeorNot);
						if(!existingTimeorNot) {
						

						

						PatientDetails byPatientId = patientDetailsRepo.getByPatientId(patientId);
						if (byPatientId != null) {
							PatientFeedbackAnalysis feedback = new PatientFeedbackAnalysis();
							feedback.setPatientId(p.getPatientId());
							feedback.setPatientName(byPatientId.getPatientName());
							feedback.setMobile(byPatientId.getMobile());
							feedback.setReceptionistId(p.getReceptionistId());
							feedback.setUploadDate(LocalDate.now().format(formatter));
//							feedback.setIssue(conversationSummeryObject.getConvodetails().getHistory_of_present_illness());
							feedback.setConversationTime(time);
					       
							patientFeedback.add(feedback);
						}

						}
				}
			});

			if (patientFeedback != null) {
				logger.info("saving data for feedback analysis ~>" + mapper.writeValueAsString(patientFeedback));
				patientFeedbackAnalysisRepo.saveAll(patientFeedback);
				List<PatientFeedbackAnalysis> byReceptionistId = patientFeedbackAnalysisRepo
						.getByReceptionistId(receptionistId);
				logger.info(
						"Getting feedback status by Receptionist Id ~>" + mapper.writeValueAsString(byReceptionistId));
				if (!byReceptionistId.isEmpty())
					return byReceptionistId;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public Object removeByPatientId(String patientId) {
		ResponseObject response = new ResponseObject();
		try {

			PatientDetails byPatientId = patientDetailsRepo.getByPatientId(patientId);
			logger.info("Patients Details by Id ~>" + mapper.writeValueAsString(byPatientId));
			if (byPatientId != null) {
				int patientDelete = patientDetailsRepo.deleteByPatientId(patientId);
				int doctorMappingDelete = patientResponseRepo.deleteByPatientId(patientId);
				logger.info("patientDelete~>" + patientDelete + "doctorMappingDelete~>" + doctorMappingDelete);
				if (patientDelete > 0 && doctorMappingDelete > 0) {
					response.setStatus("true");
					response.setMessage("Deleted Successfully.");
				} else {
					response.setStatus("false");
					response.setMessage("Failed to delete.");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	
	//old code
//	public List<PatientDetails> getAllPatientDetails(String receptionistId,String datevalue) {
//	try {
//		List<PatientDetails> patients = new ArrayList<>();
//		
//		patients = patientDetailsRepo.getByReceptionId(receptionistId,datevalue);
//		logger.info("Getting all patients based on ReceptionID~>"+mapper.writeValueAsString(patients));
//		if (!patients.isEmpty()) {
////			List<PatientDetails> descPatients = patients.stream().sorted(Comparator.comparing(PatientDetails::getUhid))
////					.collect(Collectors.toList());
//			return patients;
//		}
//		}catch(Exception e) {
//			e.printStackTrace();
//		}
//		return null;
//	}
//	

	
	//new 
	
	public List<PatientDetails> getAllPatientDetails(String receptionistId, String dateValue) {
	    try {
	        List<PatientDetails> patients = patientDetailsRepo.getByReceptionId(receptionistId, dateValue);
	        logger.info("Patients fetched: " + mapper.writeValueAsString(patients));
	        
	        if(!patients.isEmpty()) {
//	        return patients.isEmpty() ? Collections.emptyList() : patients;
	        	return patients;
	        }
	        else {
	        	logger.info("receptionist id or date value is empty");
	        	return null;
	        }
	    } catch (Exception e) {
	        logger.error("Error while fetching patient details", e);
	        return Collections.emptyList();
	    }
	}

	
	
	public Object updatePatientDetails(PatientDetails patientDetails) {
		
		ResponseObject response = new ResponseObject();
		try {
			if (patientDetails != null && !patientDetails.getUhid().isEmpty()) {
				PatientDetails existing = patientDetailsRepo.getByPatientId(patientDetails.getUhid());
				logger.info("Patient By Id ~>" + mapper.writeValueAsString(existing));
				if (existing != null) {
					existing.setAge(patientDetails.getAge());
				existing.setBloodGroup(patientDetails.getBloodGroup());
					existing.setCardNo(patientDetails.getCardNo());
					existing.setCity(patientDetails.getCity());
					existing.setOnlydate(patientDetails.getOnlydate());
					existing.setIdProofType(patientDetails.getIdProofType());
					existing.setMartialStatus(patientDetails.getMartialStatus());
					existing.setImage(patientDetails.getImage());
					existing.setNamesalute(patientDetails.getNamesalute());
					existing.setEmail(patientDetails.getEmail());
//					existing.setPatientName(patientDetails.getPatientName());
					existing.setDoctorEmail(patientDetails.getDoctorEmail());
					existing.setDoctorId(patientDetails.getDoctorId());
					existing.setDatevalue(patientDetails.getDatevalue());
					existing.setDepartment(patientDetails.getDepartment());
					existing.setDoctorName(patientDetails.getDoctorName());
					existing.setDob(patientDetails.getDob());
					existing.setGender(patientDetails.getGender());
////					existing.setMobile(patientDetails.getMobile());
					existing.setReceptionistId(patientDetails.getReceptionistId());
					existing.setAddress(patientDetails.getAddress());
					existing.setDiscount(patientDetails.getDiscount());
					existing.setRank(patientDetails.getRank());
					
					
			
				
				patientDetailsRepo.save(existing);
					
//				patientDetailsRepo.saveAndFlush(existing);
					logger.info("Existing Patient Details ~>"+mapper.writeValueAsString(existing));

					// Also updating doctor_mapping
					updateDoctorMapping(patientDetails);

					response.setMessage("Updated Successfully.");
					response.setStatus("true");
				} else {
					response.setMessage("Failed to Update");
					response.setStatus("false");
				}

			} else {
				response.setMessage("Failed to Update");
				response.setStatus("false");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setMessage("Failed to Update");
			response.setStatus("false");
		}

		return response;
	}
	
	


	private void updateDoctorMapping(PatientDetails patientDetails) {
		try {
			PatientResponse existingMapping = patientResponseRepo.fetchPatientById(patientDetails.getUhid());
			if (existingMapping != null) {
				logger.info("Doctor Mapping updation ~>" + mapper.writeValueAsString(existingMapping));
				existingMapping.setPatientEmail(patientDetails.getEmail());
				existingMapping.setDoctorId(patientDetails.getDoctorId());
				existingMapping.setDate(patientDetails.getDatevalue());
				existingMapping.setAssignedBy(patientDetails.getReceptionistId());

				patientResponseRepo.save(existingMapping);
				logger.info("Doctor Mapping updation Done..");
			}
		} catch (Exception e) {
	        logger.error("Error updating doctor mapping: ", e);
	        e.printStackTrace();
		}

	}

	public ResponseObject savePatientAppointements(PatientAppointments appointment) {
		ResponseObject response = new ResponseObject();
		try {
			logger.info("Patient appointment details ~>" + mapper.writeValueAsString(appointment));

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");

			if (appointment != null) {
				appointment.setUploadDateTime(LocalDateTime.now().format(formatter));
				appointment.setAppointmentStatus("");
				patientAppointmentsRepo.save(appointment);
				response.setStatus("true");
				response.setMessage("Appointment sent successfully.");
				logger.info("Saved Successfully.");

			} else {
				response.setStatus("false");
				response.setMessage("Failed to sent.");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus("false");
			response.setMessage("Failed to sent.");
		}
		return response;
	}

	public Object getAppointmentView() {

		try {
			List<PatientAppointments> allAppointments = patientAppointmentsRepo.findAll();

//			List<PatientAppointments> filteredAppointments = allAppointments.stream()
//					.filter(e -> "".equalsIgnoreCase(e.getAppointmentStatus())).collect(Collectors.toList());
//
//			logger.info("All appointments from backend ~>" + mapper.writeValueAsString(filteredAppointments));

			if (!allAppointments.isEmpty()) {
				return allAppointments;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public Object updateAppointmentStatus(String uniqKey, String status) {
		ResponseObject response = new ResponseObject();
		try {
			logger.info("getting from frontEnd~>" + uniqKey + " " + status);

			if (!uniqKey.isEmpty() && !status.isEmpty()) {
				int updateCount = patientAppointmentsRepo.updateAppointmentStatus(Long.valueOf(uniqKey), status);
				logger.info("updateCount ~>" + updateCount);

				if (updateCount > 0) {
					response.setMessage("Moved Successfully");
					response.setStatus("true");
				} else {
					response.setMessage("Failed to move.");
					response.setStatus("false");
				}
			} else {
				response.setMessage("Failed to move.");
				response.setStatus("false");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	public Object getMyReportsForPatients(String patientId) {

		ResponseObject response = new ResponseObject();
		List<MyReportPayload> returnData = new ArrayList<>();
		MyReportPayload payload = new MyReportPayload();

		try {
			List<PatientResponse> myReports = patientResponseRepo.getMyReports(patientId);

			logger.info("Patient reports ~>" + mapper.writeValueAsString(myReports));

			List<ConversationSummery> summary = convoRepo.getConversationHistory(patientId);

			if (myReports.isEmpty() || myReports == null) {
				response.setMessage("No Reports for Patient.");
				response.setStatus("false");
				return response;
			}

			// Setting data to MyReportPayload
			for (PatientResponse patient : myReports) {

				// adding doctor related
				String doctorId = patient.getDoctorId();

				ConversationAdminMaintainance doctorDetails = adminMaintainanceRepository.getUserByUid(doctorId);

				if (!doctorId.isEmpty()) {
					payload.setDoctorId(doctorId);
					payload.setDoctorName(doctorDetails.getUsername());
				}

				payload.setReportDate(patient.getDate());
				payload.setIssue("Fever");

				// adding summary
				for (ConversationSummery history : summary)

					payload.setConversationHistory(history.getConvodetails());

				PatientDetails patientDetails = patientDetailsRepo.getByPatientId(patientId);

				// report name -> dob + doctorName
				payload.setReportName(patientDetails.getDob() + "/" + doctorDetails.getUsername());

				returnData.add(payload);

			}

			if (!returnData.isEmpty())
				return returnData;

		} catch (Exception e) {
			logger.error("Error occured ~>", e);
		}

		return Collections.emptyList();
	}
	
	public Object updatePatientFeedbackAnalysis(PatientFeedbackAnalysis feedback) {
	    ResponseObject response = new ResponseObject();
	    try {
	        if (feedback != null && feedback.getPatientFeedbackAnalysisChild() != null) {
	        	// get one specific full object from parent
	            Optional<PatientFeedbackAnalysis> existingFeedback = patientFeedbackAnalysisRepo.getPatientById(feedback.getPatientId());
	            if (existingFeedback.isPresent()) {
	                PatientFeedbackAnalysis existing = existingFeedback.get();
		            logger.info("existing===>"+existing);

	                // Iterate through the child entries received from frontend
	                for (PatientFeedbackAnalysisChild childUpdate : feedback.getPatientFeedbackAnalysisChild()) {
	                	
	                	logger.info("childUpdate==>"+childUpdate);
	                	Long id=childUpdate.getUniId();
	                	logger.info("id is===>"+id);
	                    if (childUpdate.getUniId() != null && childUpdate.getDates() != null) {
	                       logger.info("true"); 
	                        // Search for the child by its uniId and dates
	                        Optional<PatientFeedbackAnalysisChild> childToUpdate = existing.getPatientFeedbackAnalysisChild().stream()
	                                .filter(child -> child.getUniId().equals(childUpdate.getUniId()) && child.getDates().equals(childUpdate.getDates()))
	                                .findFirst();
	                        PatientFeedbackAnalysisChild obj=childToUpdate.get();
                            logger.info("obj===>"+obj);
                        logger.info("childToUpdate======>"+childToUpdate);
	                        
	                        if (childToUpdate.isPresent()) {
	                        	
	                            // If the child is found, update the feedback
	                            PatientFeedbackAnalysisChild child = childToUpdate.get();
	                            logger.info("child===>"+child);
	                            child.setFeedBack(childUpdate.getFeedBack());
	  
	                        }
	                    }
	                }
	                
	                // Save the parent entity which will also save updated child entities due to cascading
	                patientFeedbackAnalysisRepo.save(existing);
	                
	                response.setStatus("true");
	                response.setMessage("Feedback updated successfully.");
	            } else {
	                response.setStatus("false");
	                response.setMessage("Patient record not found.");
	            }
	        } else {
	            response.setStatus("false");
	            response.setMessage("Invalid feedback data.");
	        }
	    }
	    catch(	Exception e)
	{
	        e.printStackTrace();
	        response.setStatus("false");
	        response.setMessage("Failed to update feedback.");
	    }return response;
}

	public Object getFeedBackSummeryBasedOnIdAndDate(PatientFeedbackAnalysis feedback) {
	    ResponseObject response = new ResponseObject();
	    String result="";
	    try {
	    	logger.info("call was triggered in service");
	        if (feedback != null && feedback.getPatientFeedbackAnalysisChild() != null) {
	        	// get one specific full object from parent
	        	logger.info("true");
	            Optional<PatientFeedbackAnalysis> existingFeedback = patientFeedbackAnalysisRepo.getPatientById(feedback.getPatientId());
	        	logger.info("existingFeedback====>"+existingFeedback);

	            if (existingFeedback.isPresent()) {
		        	logger.info("true====>");

	                PatientFeedbackAnalysis existing = existingFeedback.get();
		            logger.info("existing===>"+existing);

	                // Iterate through the child entries received from frontend
	                for (PatientFeedbackAnalysisChild childUpdate : feedback.getPatientFeedbackAnalysisChild()) {
	                	
	                	logger.info("childUpdate==>"+childUpdate);
	                	Long id=childUpdate.getUniId();
	                	logger.info("id is===>"+id);
	                    if (childUpdate.getUniId() != null && childUpdate.getDates() != null) {
	                       logger.info("true"); 
	                        // Search for the child by its uniId and dates
	                        Optional<PatientFeedbackAnalysisChild> childToUpdate = existing.getPatientFeedbackAnalysisChild().stream()
	                                .filter(child -> child.getUniId().equals(childUpdate.getUniId()) && child.getDates().equals(childUpdate.getDates()))
	                                .findFirst();

                        logger.info("childToUpdate======>"+childToUpdate);
	                        
	                        if (childToUpdate.isPresent()) {
	                        	
	                            // If the child is found, update the feedback
	                            PatientFeedbackAnalysisChild child = childToUpdate.get();
	                            logger.info("child===>"+child);
	                            result=   child.getFeedBack();
	                   logger.info(result);
	                        }
	                    }
	                }
	            
	                
	                response.setStatus("true");
	                response.setMessage("succesfully got the data.");
	            } else {
	                response.setStatus("false");
	                response.setMessage("Patient record not found.");
	            }
	        } else {
	            response.setStatus("false");
	            response.setMessage("Invalid feedback data.");
	        }
	    }
	    catch(	Exception e)
	{
	        e.printStackTrace();
	        response.setStatus("false");
	        response.setMessage("Failed to update feedback.");
	    }return result;
}


}
