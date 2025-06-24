package com.lawyer.service;

import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.controller.AuthController;
import com.lawyer.constants.DataSaveException;
import com.lawyer.model.ConversationAdminMaintainance;
import com.lawyer.model.ERole;
import com.lawyer.model.EmailVerification;
import com.lawyer.model.Role;
import com.lawyer.model.User;
import com.lawyer.model.UserRegistration;
import com.lawyer.payload.response.ResponseObject;
import com.lawyer.repository.ConversationAdminMaintainanceRepository;
import com.lawyer.repository.EmailVerificationRepo;
import com.lawyer.repository.RoleRepository;
import com.lawyer.repository.UserRegisterationRepo;
import com.lawyer.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

	@Autowired
	private UserRegisterationRepo userRegisterationRepo;
	
	@Autowired
	private ConversationAdminMaintainanceRepository conversationAdminMaintainanceRepository;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private EmailVerificationRepo emailVerificationRepo;
	
	@Autowired
	private JavaMailSender mailSender;
	
	private ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

	
	
	private ObjectMapper mapper = new ObjectMapper();
	private Logger logger = LoggerFactory.getLogger(AuthController.class);


	/**
	 * user registration data
	 * 
	 * @param userRegisteration user details
	 * @return user details
	 */
	public Object saveUserRegisteration(UserRegistration userRegisteration) {
		if (userRegisteration == null)
			throw new DataSaveException("Input data is null or empty.");
		try {
			return userRegisterationRepo.save(userRegisteration);
		} catch (DataIntegrityViolationException e) {
			log.error("Database integrity violation==>", e);
			throw new DataSaveException("Failed to save due to data integrity issues.");
		} catch (Exception e) {
			log.error("Unexpected error while saving==>", e);
			throw new DataSaveException("An unexpected error occurred while saving.");
		}
	}
	

	/**
	 * user login checking username and password
	 * @param userName
	 * @param password
	 * @return
	 */
	public boolean  eligibleUser(String userName,String password){
		Optional<UserRegistration> user=userRegisterationRepo.findByUserName(userName);
		if(user.isPresent()&&user.get().getPassword().equals(password)) {
			return true;
		}
		return false;
		
	}
	/**
	 * deleting user
	 * @param userid
	 */
	public void deleteuser(Long userid) {
		if(userRegisterationRepo.existsById(userid)) {
			
			userRegisterationRepo.deleteById(userid);
			log.info(userid+"user was deleted");
		}
		
	}


	public ResponseObject checkingEmaiStatus(String email) {
		ResponseObject response = new ResponseObject();
		try {
			if (email != null) {
//				boolean existingOrNot = conversationAdminMaintainanceRepository.existingOrNot(email);
				ConversationAdminMaintainance existingOrNot = conversationAdminMaintainanceRepository
						.getOneRecordByEmail(email);

				logger.info("Email ~>" + email + "existingOrNot~>" + existingOrNot);
				if (existingOrNot != null) {
					
					boolean havingLogin = userRepository.userData(email);
					
					if (!havingLogin) {

						User user = new User();
						user.setEmail(email);
						user.setUsername(email);
						user.setPassword(encoder.encode(""));

						Set<Role> role = new HashSet<>();
						Role interviewerRole = roleRepository.findByName(ERole.valueOf(existingOrNot.getRole()))
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						role.add(interviewerRole);

						user.setRoles(role);
						userRepository.save(user);
					}

					response.setStatus("true");
					response.setMessage("User Existed.");
				} else {
					response.setStatus("false");
					response.setMessage("User Not Found.");
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}


	public ResponseObject setPassword(User user) {
		ResponseObject response = new ResponseObject();
		try {
			logger.info("users details ~>" + mapper.writeValueAsString(user));

			if (user != null) {
				boolean existingOrNot = userRepository.existingOrNot(user.getUsername());
				logger.info("existing username or not ~>" + existingOrNot);
				if (existingOrNot) {

					String password = encoder.encode(user.getPassword());
					logger.info("password ~>" + password);

					int passwordUpdate = userRepository.updatePasswordForForget(user.getUsername(), password);
					logger.info("passwordUpdate ~>" + passwordUpdate);

					if (passwordUpdate > 0) {
						response.setStatus("true");
						response.setMessage("Password created Successfully.");
						logger.info("Password created Successfully.");
					} else {
						response.setStatus("false");
						response.setMessage("Password creation failed.");
					}
				} else {
					response.setStatus("false");
					response.setMessage("User not exists.");
					logger.info("User not exists.");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}
	
	public String sendOtp(Map<String, String> allParams) {
		String msg = "";
		try {
			logger.info("sendOtp in service: " + allParams);
			if (!allParams.containsKey("email")) {
				throw new IllegalArgumentException("Email parameter is missing.");
			}
			String email = allParams.get("email");
			logger.info("Email: " + email);
			// Generate OTP
			if (email != null && !email.isEmpty()) {
				String otp = generateOTP();
				logger.info("Generated OTP: " + otp);
				EmailVerification emailAuthentication = new EmailVerification();
				emailAuthentication.setEmail(email);
				emailAuthentication.setOtp(otp);
//			emailAuthentication.setVerifiedStatus(false);
				emailVerificationRepo.save(emailAuthentication);
				logger.info("OTP saved/updated in database for email: " + email);
				// Send OTP to user's email
				SimpleMailMessage message = new SimpleMailMessage();
				message.setTo(email);
				message.setSubject("Your OTP for Verification");
				message.setText("Your OTP is: " + otp + "\nPlease note that this OTP is valid for 2 minutes");
				// this is for otp timeout
				executorService.schedule(new Runnable() {
					@Override
					public void run() {
						try {
							expireOtp(otp);
						} catch (JsonProcessingException e) {
							e.printStackTrace();
						}
					}
				}, 2, TimeUnit.MINUTES);
//			logger.info()
				mailSender.send(message);
				msg = "Mail sent successfully to" + email;
				logger.info("Mail sent successfully to " + email);

			}
			return msg;
		} catch (IllegalArgumentException e) {
			logger.error("Invalid arguments: " + e.getMessage());
			msg = e.getMessage();
			return msg;
		} catch (Exception e) {
			logger.error("Error in sendOtp method: " + e.getMessage(), e);
			msg = e.getMessage();
			return "Invalid Email";
		}

	}

	private void expireOtp(String codes) throws JsonProcessingException {
		logger.info("Expired otp method hitted..................." + mapper.writeValueAsString(codes));
		int a = emailVerificationRepo.removeRequestByOTP(codes);
		if (a > 0) {
			logger.info("Otp expired.....");
		} else {
			logger.info("Otp not updated.....");
		}
	}

	public String generateOTP() {
		Random random = new Random();
		int otp = 100000 + random.nextInt(900000); // 6-digit OTP
		return String.valueOf(otp);
	}

	public boolean verifyOtp(Map<String, String> allParams) {
		try {
			String mail = allParams.get("email");
			String otp = allParams.get("otp");
			if (mail == null || otp == null) {
				logger.error("Email or OTP is missing in the input parameters.");
				return false;
			}
			EmailVerification emailAuthentication = emailVerificationRepo.getVerifyEmail(mail, otp);
			if (emailAuthentication == null) {
				logger.info("No matching record found for email: " + mail);
				return false;
			}
			logger.info("Fetched EmailAuthentication: " + mapper.writeValueAsString(emailAuthentication));
			// Verify the OTP and email match
			if (emailAuthentication.getEmail().equalsIgnoreCase(mail) && emailAuthentication.getOtp().equals(otp)) {
				// emailAuthentication.setVerifiedStatus(true);
				// EmailAuthenticationRepo.save(emailAuthentication);
				int deletedRecord = emailVerificationRepo.removeRequestByOTP(otp);
				logger.info("deletedRecord===>" + deletedRecord);
				// sendOtp(allParams);
				logger.info("OTP verified successfully for email: " + mail);
				return true;
			} else {
				logger.info("OTP verification failed for email: " + mail);
				return false;
			}
		} catch (Exception e) {
			logger.error("Error occurred during OTP verification: " + e.getMessage(), e);
			return false;
		}
	}
	
	
}
