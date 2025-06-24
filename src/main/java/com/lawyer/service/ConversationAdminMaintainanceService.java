package com.lawyer.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.helpers.DateFormatterHelper;
import com.lawyer.model.ConversationAdminMaintainance;
import com.lawyer.model.DepartmentsForAIScribe;
import com.lawyer.model.ERole;
import com.lawyer.model.EmployeeDateAndTime;
import com.lawyer.model.EmployeeMaintanancePayload;
import com.lawyer.model.PatientAppointments;
import com.lawyer.model.Role;
import com.lawyer.model.User;
import com.lawyer.payload.response.ResponseObject;
import com.lawyer.repository.ConversationAdminMaintainanceRepository;
import com.lawyer.repository.DepartmentsForAIScribeRepo;
import com.lawyer.repository.PatientAppointmentsRepo;
import com.lawyer.repository.RoleRepository;
import com.lawyer.repository.UserRepository;

@Service
public class ConversationAdminMaintainanceService {

	private ObjectMapper mapper = new ObjectMapper();
	private Logger logger = LoggerFactory.getLogger(ConversationAdminMaintainanceService.class);

	@Autowired
	private ConversationAdminMaintainanceRepository conversationAdminMaintainanceRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private DepartmentsForAIScribeRepo departmentsForAIScribeRepo;

	@Autowired
	private PatientAppointmentsRepo patientAppointmentsRepo;

	/**
	 * 
	 * @param admindata
	 * @return
	 */

	public ResponseObject saveAdminMaintainancedata(List<EmployeeMaintanancePayload> admindata) {
		ResponseObject response = new ResponseObject();
		List<ConversationAdminMaintainance> returnData = new ArrayList<>();
		ConversationAdminMaintainance saveInfo = new ConversationAdminMaintainance();

		try {
			DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");

			logger.info("admin data from front end ~>" + mapper.writeValueAsString(admindata));

			if (!admindata.isEmpty()) {
				List<ConversationAdminMaintainance> existing = conversationAdminMaintainanceRepository.findAll();
				logger.info("existing ~>" + mapper.writeValueAsString(existing));

				// Remove duplicate entries
				if (!existing.isEmpty()) {
					admindata.forEach(details -> details.getViewData().removeIf(view -> existing.stream()
							.anyMatch(e -> e.getEmail() != null && details.getEmail() != null
									&& e.getEmail().equalsIgnoreCase(details.getEmail()) && e.getDate() != null
									&& view.getDate() != null && e.getDate().equalsIgnoreCase(view.getDate()))));

					logger.info("filtered admindata ~>" + mapper.writeValueAsString(admindata));
				}

				if (!admindata.isEmpty()) {
//					boolean dataSaved = false;

					// Map to store unique IDs for emails
//					Map<String, String> emailToUniqueIdMap = new HashMap<>();

					for (EmployeeMaintanancePayload email : admindata) {
//						String uniqIdForUsers = emailToUniqueIdMap.computeIfAbsent(email.getEmail(), k -> {
						String generatedId = generateUniqIdForUsers(email);

						logger.info("Generated UID for user " + email.getEmail() + " ~>" + generatedId);
//							return generatedId;
//						});

						if (!email.getViewData().isEmpty()) {

							for (EmployeeDateAndTime view : email.getViewData()) {

								// Create a new record for each date in viewData
								saveInfo.setId(generatedId);
								saveInfo.setDepartment(email.getDepartment());
								saveInfo.setEmail(email.getEmail());
								saveInfo.setPhoneNo(email.getPhoneNo());
								saveInfo.setRole(email.getRole());
								saveInfo.setUploadDateTime(LocalDateTime.now().format(dateTimeFormatter));
								saveInfo.setUploadedBy(email.getUploadedBy());
								saveInfo.setUsername(email.getUsername());
								saveInfo.setAvailableSlots(view.getAvailableTime());
								saveInfo.setDate(view.getDate());

								returnData.add(saveInfo);
//							dataSaved = true;

								// login and send email for new users
								if (email.getEmail() != null) {
									boolean havingLogin = userRepository.userData(email.getEmail());
									logger.info("Login status ~>" + havingLogin);

									if (!havingLogin) {
										createLoginForUsers(email);
									}
								}
							}
						} else {

							saveInfo.setId(generatedId);
							saveInfo.setDepartment(email.getDepartment());
							saveInfo.setEmail(email.getEmail());
							saveInfo.setPhoneNo(email.getPhoneNo());
							saveInfo.setRole(email.getRole());
							saveInfo.setUploadDateTime(LocalDateTime.now().format(dateTimeFormatter));
							saveInfo.setUploadedBy(email.getUploadedBy());
							saveInfo.setUsername(email.getUsername());

							returnData.add(saveInfo);

							if (email.getEmail() != null) {
								boolean havingLogin = userRepository.userData(email.getEmail());
								logger.info("Login status ~>" + havingLogin);

								if (!havingLogin) {
									createLoginForUsers(email);
								}
							}

						}
					}

					logger.info("Returning Data ~>" + mapper.writeValueAsString(returnData));

//					if (dataSaved) {
					conversationAdminMaintainanceRepository.saveAll(returnData);
					response.setMessage("Saved Successfully.");
					response.setStatus("true");
//					} else {
//						response.setMessage("No new data to save.");
//						response.setStatus("false");
//					}
				} else {
					response.setMessage("Failed to Save: No unique data.");
					response.setStatus("false");
				}
			} else {
				response.setMessage("Failed to save. Front-end data is null.");
				response.setStatus("false");
			}
		} catch (Exception e) {
			logger.error("An error occurred while processing data: ", e);
			response.setMessage("An error occurred while saving data.");
			response.setStatus("false");
		}

		return response;
	}

	private void createLoginForUsers(EmployeeMaintanancePayload email) {

		if (!email.getEmail().isEmpty()) {
			boolean existed = userRepository.userData(email.getEmail());
			logger.info("existed status ~>" + existed);

			if (!existed) {

				User user = new User();
				user.setEmail(email.getEmail());
				user.setUsername(email.getEmail());
				String password = UUID.randomUUID().toString().substring(0, 6);
				user.setPassword(encoder.encode(password));

				logger.info("Username and Password ~>" + email.getEmail() + " " + password);

				Set<Role> role = new HashSet<>();

				String roleName = !email.getRole().isEmpty() ? email.getRole() : "ROLE_DOCTOR";
				Role interviewerRole = roleRepository.findByName(ERole.valueOf(roleName))
						.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
				role.add(interviewerRole);

				user.setRoles(role);
				userRepository.save(user);

				// mail sending

				SimpleMailMessage mail = new SimpleMailMessage();
				mail.setTo(email.getEmail());
				mail.setSubject("Your Login Credentials");
				String content = "Dear User,\n\n" + "We are pleased to provide you with your login credentials.\n\n"
						+ "Username: " + email.getEmail() + "\n" + "Password: " + password + "\n\n"
						+ "Please ensure you keep your credentials secure. If you did not request these details, please contact support immediately.\n\n"
						+ "Thank you..\n";
				mail.setText(content);
				mailSender.send(mail);
				logger.info("Mail sent Successfully.");
			} else {
				logger.info("Have Logins Already....");
			}

		}

	}

	// Generating UniqId for Users

	private String generateUniqIdForUsers(EmployeeMaintanancePayload payload) {
		try {

			String id = payload.getId();

			// Checking the email has Id or not

			ConversationAdminMaintainance byEmail = conversationAdminMaintainanceRepository
					.getOneRecordByEmail(payload.getEmail());

			logger.info("Existed Email in Db ~>" + mapper.writeValueAsString(byEmail));

			if (byEmail != null && !byEmail.getId().isEmpty()) {
				logger.info("Already existed email so we need to put the existed UID ~~~>");
				return byEmail.getId();
			}

			// normal process

			String lastID = conversationAdminMaintainanceRepository.getLastUniqNumber();

			logger.info("Getting Latest Unique ID ~>" + lastID);
			if (lastID != null && !lastID.isEmpty()) {

				if (id == null || id.isEmpty()) {

					logger.info("studentId from frontend in==> " + id);

					String numericPart = lastID.substring(3);// len=6 -> 000010 (0,5)

					logger.info("numericPart==> " + numericPart);

					String onlyNumber = numericPart.split("/")[0];

					Long numbers = Long.valueOf(onlyNumber); // 6
					logger.info("numbers==> " + numbers);

					String convertedString = String.valueOf(++numbers); // 7
					logger.info("convertedString==> " + convertedString);

					String newUHID = "UID" + numericPart.substring(0, onlyNumber.length() - convertedString.length())
							+ convertedString + "/" + LocalDate.now().getYear(); // 6-1 (0,5)
					logger.info("new UID Number==> " + newUHID);
					return newUHID;
				}
			} else {
				// for the first time
				int year = LocalDate.now().getYear();
				String newUHID = "UID000001" + "/" + year;
				return newUHID;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}

//	public List<ConversationAdminMaintainance> getAllMainatainanceData() {
//
//		try {
//			Optional<List<ConversationAdminMaintainance>> findAll = Optional
//					.ofNullable(conversationAdminMaintainanceRepository.findAll());
//			if (findAll.isPresent()) {
//				List<ConversationAdminMaintainance> result = findAll.get();
//				logger.info("result from backend ~>" + mapper.writeValueAsString(result));
//
//				List<ConversationAdminMaintainance> orderedList = result.stream()
//						.sorted(Comparator.comparing(ConversationAdminMaintainance::getAdminId).reversed())
//						.collect(Collectors.toList());
//				if (!orderedList.isEmpty())
//					return orderedList;
//			} else
//				return Collections.emptyList();
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		return null;
//	}

	// Getting all details based on email 
	public List<EmployeeMaintanancePayload> getAllMainatainanceData() {
	    try {
	        Optional<List<ConversationAdminMaintainance>> findAll = Optional
	                .ofNullable(conversationAdminMaintainanceRepository.findAll());
	        if (findAll.isPresent()) {
	            List<ConversationAdminMaintainance> result = findAll.get();
	            logger.info("result from backend ~>" + mapper.writeValueAsString(result));
	            if (!result.isEmpty()) {
	            	
	                // Group by email
	                Map<String, List<ConversationAdminMaintainance>> groupedByEmail = result.stream()
	                        .collect(Collectors.groupingBy(ConversationAdminMaintainance::getEmail));
	               
	                logger.info("Grouped By Email ~>"+mapper.writeValueAsString(groupedByEmail));
	                List<EmployeeMaintanancePayload> orderedList = new ArrayList<>();
	                groupedByEmail.forEach((email, records) -> {
	                    EmployeeMaintanancePayload payload = new EmployeeMaintanancePayload();
	                    ConversationAdminMaintainance firstRecord = records.get(0);
	                    payload.setId(firstRecord.getId());
	                    payload.setDepartment(firstRecord.getDepartment());
	                    payload.setEmail(email);
	                    payload.setPhoneNo(firstRecord.getPhoneNo());
	                    payload.setRole(firstRecord.getRole());
	                    payload.setUploadedBy(firstRecord.getUploadedBy());
	                    payload.setUsername(firstRecord.getUsername());
	                    List<EmployeeDateAndTime> viewData = records.stream().map(record -> {
	                        EmployeeDateAndTime dateAndTime = new EmployeeDateAndTime();
	                        dateAndTime.setAvailableTime(record.getAvailableSlots());
	                        dateAndTime.setDate(record.getDate());
	                        dateAndTime.setUniqKey(record.getAdminId().toString());
	                        return dateAndTime;
	                    }).collect(Collectors.toList());
	                    payload.setViewData(viewData);
	                    orderedList.add(payload);
	                });
	                // Sort by ID in descending order
	               
	                return orderedList.stream()
	                        .sorted(Comparator.comparing(
	                                EmployeeMaintanancePayload::getId,
	                                Comparator.nullsLast(Comparator.naturalOrder())
	                        ).reversed())
	                        .collect(Collectors.toList());
	            }
	        } else {
	            return Collections.emptyList();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return null;
	}



	public List<ConversationAdminMaintainance> getDoctorsOnly(String department) {
		List<ConversationAdminMaintainance> doctorsOnly = new ArrayList<>();
		try {
			List<ConversationAdminMaintainance> getDoctorsByDept = conversationAdminMaintainanceRepository
					.getDoctorsByDept(department);
			logger.info("Getting entire table ~>" + mapper.writeValueAsString(getDoctorsByDept));

			doctorsOnly = getDoctorsByDept.stream()
					.filter(e -> e.getRole().equalsIgnoreCase(String.valueOf(ERole.ROLE_DOCTOR))).distinct()
					.collect(Collectors.toList());

			logger.info("Getting doctors from Db ~>" + mapper.writeValueAsString(doctorsOnly));

			if (!doctorsOnly.isEmpty())
				return doctorsOnly.stream()
				        .collect(Collectors.toMap(
				            ConversationAdminMaintainance::getEmail,
				            doctor -> doctor,
				            (existing, replacement) -> existing))
				        .values()
				        .stream()
				        .collect(Collectors.toList());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<String> getDepartments() {
		List<String> getAllDeps = new ArrayList<>();
		try {
			getAllDeps = conversationAdminMaintainanceRepository.getDistinctDepts();

			logger.info("List of departments ~>" + mapper.writeValueAsString(getAllDeps));

			return getAllDeps;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<String> getAvailableSlots(String patientEmail, String doctorId,String dateValue) {
		List<String> routineSlots = new ArrayList<>();
		try {
//			logger.info("praveen logger===>"+doctorId + "patientEmail" + patientEmail + "dateValue" + dateValue);
			String allSlots= conversationAdminMaintainanceRepository.getAllSlotsByDoctorId(doctorId,dateValue);
			logger.info("allSlots====>"+ mapper.writeValueAsString(allSlots));

			if (!allSlots.isEmpty()) 
			{

				routineSlots = Arrays.asList(allSlots.split("~"));

				logger.info("Doctor available Slots ~>" + mapper.writeValueAsString(routineSlots));

//				 if u want to validation for patient like if patient select one slots we need
//				 to show remain slots of doctor
//				List<String> usedSlots = patientAppointmentsRepo.getPatientUsedSlotsByCurrentDate(patientEmail,
//						doctorId);

				List<String> usedSlots = patientAppointmentsRepo.getPatientUsedSlotsByCurrentDate(doctorId,dateValue);

				logger.info("Patient used slots ~>" + mapper.writeValueAsString(usedSlots));

				if (!usedSlots.isEmpty() && !routineSlots.isEmpty()) {
					List<String> filteredSlots = routineSlots.stream().filter(e -> !usedSlots.contains(e))
							.collect(Collectors.toList());

					logger.info("filtered slots ~>" + mapper.writeValueAsString(filteredSlots));

//// add deactive slots to filtered slots

					List<String> deActiveAssignedSlots = patientAppointmentsRepo.getDeactiveSlots(dateValue);
logger.info("deActiveAssignedSlots is "+deActiveAssignedSlots);
					if (!deActiveAssignedSlots.isEmpty()) {
						List<String> allAvailableSlots = new ArrayList<>();
						allAvailableSlots.addAll(filteredSlots);
						allAvailableSlots.addAll(deActiveAssignedSlots);
						logger.info("allAvailableSlots is "+allAvailableSlots);

						return allAvailableSlots;
					} else {
//					if (!filteredSlots.isEmpty())
						return filteredSlots;
					}
				} else {
					return routineSlots;
				}
			}
			else {
				
				logger.info(doctorId+"doctor doesnot have slots on that day");
				
//				return new ArrayList<>(); 
			
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public Object updateUserDetails(EmployeeMaintanancePayload user) {
	    ResponseObject response = new ResponseObject();
	    try {
	        logger.info("User details from frontend ~>" + mapper.writeValueAsString(user));
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");
	        if (user != null) {
	            List<EmployeeDateAndTime> dateAndSlots = user.getViewData();
	            logger.info("Date and slots ~>" + mapper.writeValueAsString(dateAndSlots));
	            for (EmployeeDateAndTime slotData : dateAndSlots) {
	                String uniqKey = slotData.getUniqKey();
	                logger.info("uniqKey from frontend ~>" + uniqKey);
	                if (uniqKey != null && !uniqKey.isEmpty()) {
	                    Optional<ConversationAdminMaintainance> byUniqId = conversationAdminMaintainanceRepository
	                            .findById(Long.valueOf(uniqKey));
	                    if (byUniqId.isPresent()) {
	                        ConversationAdminMaintainance existedUser = byUniqId.get();
	                        if (existedUser != null) {
	                            if (!user.getEmail().equalsIgnoreCase(existedUser.getEmail())) {
	                               
	                                User byEmail = userRepository.findByEmail(existedUser.getEmail());
	                                logger.info("User logins ~>" + mapper.writeValueAsString(byEmail));
	                                if (byEmail != null && byEmail.getId() != null) {
	                                    int deletedUserRole = userRepository.delectUsersRole(byEmail.getId().intValue());
	                                    int deletedUser = userRepository.delectUsers(byEmail.getId().intValue());
	                                    if (deletedUserRole > 0 && deletedUser > 0) {
	                                        logger.info("Deleted logins successfully.");
	                                    }
	                                }
	                                createLoginForUsers(user);
	                            }
	                            // Update user fields
	                            existedUser.setDepartment(user.getDepartment());
	                            existedUser.setEmail(user.getEmail());
	                            existedUser.setId(user.getId());
	                            existedUser.setPhoneNo(user.getPhoneNo());
	                            existedUser.setRole(user.getRole());
	                            existedUser.setUsername(user.getUsername());
	                            existedUser.setUploadDateTime(LocalDateTime.now().format(formatter));
	                            existedUser.setUploadedBy(user.getUploadedBy());
	                            existedUser.setAvailableSlots(slotData.getAvailableTime());
	                            existedUser.setDate(slotData.getDate());
	                            conversationAdminMaintainanceRepository.save(existedUser);
	                            response.setStatus("true");
	                            response.setMessage("Updated successfully");
	                            logger.info("Updated successfully.");
	                        } else {
	                            response.setStatus("false");
	                            response.setMessage("Failed to update.");
	                        }
	                    }
	                } else {
	                	
	                	// If Uniqkey is empty we consider as a new user
	                  
	                    ConversationAdminMaintainance newUser = new ConversationAdminMaintainance();
	                    newUser.setDepartment(user.getDepartment());
	                    newUser.setEmail(user.getEmail());
	                    newUser.setId(user.getId());
	                    newUser.setPhoneNo(user.getPhoneNo());
	                    newUser.setRole(user.getRole());
	                    newUser.setUsername(user.getUsername());
	                    newUser.setUploadDateTime(LocalDateTime.now().format(formatter));
	                    newUser.setUploadedBy(user.getUploadedBy());
	                    newUser.setAvailableSlots(slotData.getAvailableTime());
	                    newUser.setDate(slotData.getDate());
	                    conversationAdminMaintainanceRepository.save(newUser);
	                    response.setStatus("true");
	                    response.setMessage("Saved new record successfully");
	                    logger.info("Saved new record successfully.");
	                }
	            }
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        response.setStatus("false");
	        response.setMessage("An error occurred while updating user details.");
	    }
	    return response;
	}
	
	
	public Object removeUserDetails(String adminId) {
		ResponseObject response = new ResponseObject();
		try {
			Optional<ConversationAdminMaintainance> byId = conversationAdminMaintainanceRepository
					.findById(Long.valueOf(adminId));
			if (byId.isPresent()) {
				ConversationAdminMaintainance existing = byId.get();
				conversationAdminMaintainanceRepository.deleteById(Long.valueOf(adminId));

				if (existing != null && !existing.getEmail().isEmpty()) {
					User userLogins = userRepository.findByEmail(existing.getEmail());
					logger.info("User login ~>" + mapper.writeValueAsString(userLogins));

					if (userLogins != null) {
						int delectUsersRole = userRepository.delectUsersRole(userLogins.getId().intValue());
						int delectUsers = userRepository.delectUsers(userLogins.getId().intValue());
						if (delectUsersRole > 0 && delectUsers > 0) {
							logger.info("Deleted Logins Successfully.");
						}
					}
				}
				response.setStatus("true");
				response.setMessage("Deleted Successfully.");
			} else {
				response.setStatus("false");
				response.setMessage("Failed to Delete.");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus("false");
			response.setMessage("Failed to Delete.");
		}
		return response;
	}

	public Object deleteUserByUid(String uId) {
		ResponseObject response = new ResponseObject();
		try {
			ConversationAdminMaintainance existing = conversationAdminMaintainanceRepository.getUserByUid(uId);
			logger.info("Existed UHID from backend~>" + mapper.writeValueAsString(existing));
			if (existing != null) {

				int deleteByUID = conversationAdminMaintainanceRepository.deleteByUID(existing.getId());
				if (deleteByUID > 0)
					logger.info("UHID Deleted successfully ~>");

				if (existing != null && !existing.getEmail().isEmpty()) {
					User userLogins = userRepository.findByEmail(existing.getEmail());
					logger.info("User login ~>" + mapper.writeValueAsString(userLogins));

					if (userLogins != null) {
						int delectUsersRole = userRepository.delectUsersRole(userLogins.getId().intValue());
						int delectUsers = userRepository.delectUsers(userLogins.getId().intValue());
						if (delectUsersRole > 0 && delectUsers > 0) {
							logger.info("Deleted Logins Successfully.");
						}
					}
				}
				response.setStatus("true");
				response.setMessage("Deleted Successfully.");
			} else {
				response.setStatus("false");
				response.setMessage("Failed to Delete.");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus("false");
			response.setMessage("Failed to Delete.");
		}
		return response;
	}

	public Object saveDeptDetails(List<DepartmentsForAIScribe> departments) {
		ResponseObject response = new ResponseObject();
		try {
			logger.info("Getting data from FrontEnd ~>" + mapper.writeValueAsString(departments));
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");

			if (departments != null) {

				List<DepartmentsForAIScribe> existing = departmentsForAIScribeRepo.findAll();

				departments.removeIf(
						dept -> existing.stream().anyMatch(e -> e.getDeptName().equalsIgnoreCase(dept.getDeptName())));

				logger.info("Unique Data to be saved ~>" + mapper.writeValueAsString(departments));

				departments.forEach(e -> e.setUploadDateTime(LocalDateTime.now().format(formatter)));
				departmentsForAIScribeRepo.saveAll(departments);
				response.setStatus("true");
				response.setMessage("Saved Successfully.");
			} else {
				response.setStatus("false");
				response.setMessage("Failed to Save.");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	public List<DepartmentsForAIScribe> getDepartmentsForRegistration() {
		List<DepartmentsForAIScribe> depts = new ArrayList<>();
		try {
			depts = departmentsForAIScribeRepo.findAll();
			if (depts != null)
				return depts;
			else
				Collections.emptyList();

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public Object deleteDeptByID(String deptId) {
		ResponseObject response = new ResponseObject();
		try {
			Optional<DepartmentsForAIScribe> department = departmentsForAIScribeRepo.findById(Long.valueOf(deptId));
			if (department.isPresent()) {
				departmentsForAIScribeRepo.deleteById(Long.valueOf(deptId));
				response.setStatus("true");
				response.setMessage("Deleted Successfully.");
				logger.info("Deleted Successfully.");
			} else {
				response.setStatus("false");
				response.setMessage("Failed to Delete.");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	public Object updateDepartments(DepartmentsForAIScribe dept) {
		ResponseObject response = new ResponseObject();
		try {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");
			logger.info("Department from front end ~>" + mapper.writeValueAsString(dept));
			if (dept != null) {

				dept.setUploadDateTime(LocalDateTime.now().format(formatter));

				departmentsForAIScribeRepo.save(dept);
				response.setStatus("true");
				response.setMessage("Updated Successfully");
			} else {
				response.setStatus("false");
				response.setMessage("Failed to update");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	public byte[] downloadTemplate() throws IOException {

		String[] headers = { "Doctor_Name", "Email", "Department", "ContactNo", "Date", "Slots" };

		try (Workbook workbook = new XSSFWorkbook()) {
			Sheet sheet = workbook.createSheet("Hospital Template");

			// Create the header row
			Row headerRow = sheet.createRow(0);
			CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			headerStyle.setAlignment(HorizontalAlignment.CENTER);
			XSSFFont font = (XSSFFont) workbook.createFont();
			font.setBold(true);
			font.setColor(IndexedColors.WHITE.getIndex());
			headerStyle.setFont(font);

			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(headerStyle);
			}

			sheet.addMergedRegion(new CellRangeAddress(0, 0, 5, 8));

			for (int i = 0; i < headers.length; i++) {
				sheet.autoSizeColumn(i);
			}

			try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
				workbook.write(out);
				return out.toByteArray();
			}
		}

	}

	private String nullChecking(String value) {
		return (value != null && !("null".equalsIgnoreCase(value)) && !value.isEmpty()) ? value : "";
	}

	public Object uploadEmployeeDetailsFile(MultipartFile file, String adminId) {
		List<ConversationAdminMaintainance> staffDetails = new ArrayList<>();
		ResponseObject response = new ResponseObject();
		Workbook workBook = null;
		try {
			DateTimeFormatter formatterWithTime = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");
			String name = file.getOriginalFilename();
			logger.info(name);
			String extension = "";
			if (name.contains(".")) {
				extension = name.substring(name.lastIndexOf("."));
			}
			if (extension.equalsIgnoreCase(".xls")) {
				workBook = new HSSFWorkbook(file.getInputStream());
				logger.info("Entered into xls info block");
			} else if (extension.equalsIgnoreCase(".xlsx")) {
				logger.info("Entered into xlsx info block");
				workBook = new XSSFWorkbook(file.getInputStream());
			}
			if (workBook != null) {
				Sheet sheet = workBook.getSheetAt(0);
				Row headerRow = sheet.getRow(0);
				String[] expectedHeaders = { "Doctor_Name", "Email", "Department", "ContactNo", "Date", "Slots" };
				boolean isHeaderValid = true;
				for (int i = 0; i < expectedHeaders.length; i++) {
					if (headerRow == null || headerRow.getCell(i) == null
							|| !expectedHeaders[i].equalsIgnoreCase(headerRow.getCell(i).getStringCellValue())) {
						isHeaderValid = false;
						response.setStatus("false");
						response.setMessage("Invalid headers in the uploaded file.");
						break;
					}
				}
				logger.info("Headers matched status~>" + isHeaderValid);
				if (isHeaderValid) {
					DataFormatter dataFormatter = new DataFormatter();
					for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
						Row row = sheet.getRow(rowIndex);
						if (row != null) {
							ConversationAdminMaintainance staffInfo = new ConversationAdminMaintainance();
//								employeeInfo.setEmpId(nullChecking(dataFormatter.formatCellValue(row.getCell(0))));
//							staffInfo.setRole(nullChecking(dataFormatter.formatCellValue(row.getCell(1))));
							staffInfo.setUsername(nullChecking(dataFormatter.formatCellValue(row.getCell(0))));
							staffInfo.setEmail(nullChecking(dataFormatter.formatCellValue(row.getCell(1))));
							staffInfo.setDepartment(nullChecking(dataFormatter.formatCellValue(row.getCell(2))));
							staffInfo.setPhoneNo(nullChecking(dataFormatter.formatCellValue(row.getCell(3))));
							String dateValidation = nullChecking(dataFormatter.formatCellValue(row.getCell(4)));
							logger.info("Getting date from excel ~>" + dateValidation);
							String desiredFormat = DateFormatterHelper.convertDate(dateValidation);
							logger.info("Getting desired format ~> " + desiredFormat);
							staffInfo.setDate(nullChecking(desiredFormat));
							String availableTime = "";
							String availableTime1 = nullChecking(dataFormatter.formatCellValue(row.getCell(5)));
							String availableTime2 = nullChecking(dataFormatter.formatCellValue(row.getCell(6)));
							String availableTime3 = nullChecking(dataFormatter.formatCellValue(row.getCell(7)));
							String availableTime4 = nullChecking(dataFormatter.formatCellValue(row.getCell(8)));
							availableTime = availableTime1 + "~" + availableTime2 + "~" + availableTime3 + "~"
									+ availableTime4;
							staffInfo.setAvailableSlots(availableTime);
							staffInfo.setUploadDateTime(LocalDateTime.now().format(formatterWithTime));
							staffInfo.setUploadedBy(adminId);
							staffInfo.setRole(String.valueOf(ERole.ROLE_DOCTOR));
							EmployeeMaintanancePayload emp = new EmployeeMaintanancePayload();
							emp.setId(staffInfo.getId());
							emp.setEmail(staffInfo.getEmail());
							emp.setRole(String.valueOf(ERole.ROLE_DOCTOR));
							logger.info("Employee data ~>" + mapper.writeValueAsString(emp));
							String uniqIdForUsers = generateUniqIdForUsers(emp);
							staffInfo.setId(uniqIdForUsers);
//							staffDetails.add(staffInfo);
							logger.info("Excel each record" + mapper.writeValueAsString(staffInfo));
							// need to put validation here like if emp having record with
//							same date with available time we are not allowed
							List<ConversationAdminMaintainance> existing = conversationAdminMaintainanceRepository.getByEmailId(staffInfo.getEmail());
							logger.info("Existing details ~>"+mapper.writeValueAsString(existing));
							
							if (!existing.isEmpty()) {
								for (ConversationAdminMaintainance userDetails : existing) {
									if (staffInfo.getEmail().equalsIgnoreCase(userDetails.getEmail())
											&& !staffInfo.getDate().equals(userDetails.getDate())) {
										// Logins and mail sending
										createLoginForUsers(emp);
										response.setStatus("true");
										response.setMessage("File Uploaded Succesfully");
										conversationAdminMaintainanceRepository.save(staffInfo);
										logger.info("File Uploaded Succesfully~~~~~~~~~~~~~~~~~~>");
									} else {
										response.setStatus("false");
										response.setMessage(staffInfo.getEmail() +" Already existed with this Date :"+staffInfo.getDate());
										logger.info("Duplicate email with Date~~~~~~~~>");
									}
								}
							}else {
								
								logger.info("Fresh user ~~>");
								createLoginForUsers(emp);
								response.setStatus("true");
								response.setMessage("File Uploaded Succesfully");
								conversationAdminMaintainanceRepository.save(staffInfo);
								logger.info("File Uploaded Succesfully~~~~~~~~~~~~~~~~~~>");
							}
							
						}
					}
//					logger.info("Staff Details ~>"+mapper.writeValueAsString(staffDetails));
//					if (!staffDetails.isEmpty()) {
//
//						List<String> collect = staffDetails.stream().map(e -> e.getEmail()).distinct()
//								.collect(Collectors.toList());
//
//						logger.info("Distinct emails ~>" + mapper.writeValueAsString(collect));
//
//						for (String eachUser : collect) {
//
//							EmployeeMaintanancePayload forLoginMail = new EmployeeMaintanancePayload();
//
//							forLoginMail.setEmail(eachUser);
//							logger.info("Eligible for logins ~>" + mapper.writeValueAsString(forLoginMail));
////							forLoginMail.setRole(eachUser.getRole());
//
//							createLoginForUsers(forLoginMail);
//						}
//						response.setStatus("true");
//						response.setMessage("File Uploaded Succesfully");
//						conversationAdminMaintainanceRepository.saveAll(staffDetails);
//						logger.info("File Uploaded Succesfully~~~~>");
//
//					}
				} else {
					response.setStatus("false");
					response.setMessage("Failed to Save.");
				}
			}
		} catch (Exception e) {
			logger.error("Error while uploading daily basics timetable: {}", e.getMessage());
			response.setStatus("false");
			response.setMessage("Failed to Save.");
		}
		return response;
	}
	
	
	
	
	

	public List<PatientAppointments> getPatientAppointmentsService(String patientMail) {

		try {
			logger.info("get patient appointments==>" + mapper.writeValueAsString(patientMail));

			List<PatientAppointments> appointmentsResult = patientAppointmentsRepo.getPatinetAppointments(patientMail);
			return appointmentsResult;

		} catch (Exception e) {
			// TODO: handle exception
			logger.info("throwing the exception" + e.getMessage());
			return null;
		}

	}

	/**
	 *
	 * @param uniqueKey
	 * @param patientAppointments
	 * @return
	 */

	public PatientAppointments updatePatientAppointment(Long uniqueKey, PatientAppointments patientAppointments) {

		Optional<PatientAppointments> specificAppointment = patientAppointmentsRepo.findById(uniqueKey);
		logger.info("uniqueKey ==>" + uniqueKey);
		try {
			if (specificAppointment.isPresent()) {

				PatientAppointments updateAppointment = specificAppointment.get();

				updateAppointment.setAssignedSlot(patientAppointments.getAssignedSlot());

				return patientAppointmentsRepo.save(updateAppointment);
			} else {
				logger.info("primary key is not available" + uniqueKey);
				return null;
			}
		} catch (Exception e) {
			// TODO: handle exception
			logger.info("throwing the exception" + e.getMessage());
			return null;

		}

	}

	/**
	 * 
	 * @param uniqueKey
	 * @param patientAppointments
	 * @return
	 */
	public PatientAppointments updateStatusForCancel(Map<String, String> allParms) {
//		String uniqueKey = allParms.get("uniqueKey");
//		String status = allParms.get("status");
		String uniqueKey = allParms.get("uniqueKey");
		String status = allParms.get("cancelStatus");
		String status1 = allParms.get("cancelStatus");

		
		logger.info("allParms from frontend -->"+allParms);
logger.info("status is "+status);
logger.info("uniqueKey"+uniqueKey);
		Optional<PatientAppointments> singlePatientRecord = patientAppointmentsRepo.findById(Long.parseLong(uniqueKey));
		

		try {
			logger.info("singlePatientRecord is "+singlePatientRecord);

			if (singlePatientRecord.isPresent()) {
				PatientAppointments updatledSinglePatientRecordData = singlePatientRecord.get();
				updatledSinglePatientRecordData.setCancelStatus(status);
				PatientAppointments data = patientAppointmentsRepo.save(updatledSinglePatientRecordData);

				return data;

			} else {
				return null;

			}

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
