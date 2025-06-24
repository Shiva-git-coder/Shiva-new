package com.lawyer.controller;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.config.DecryptPassword;
import com.lawyer.model.ConversationAdminMaintainance;
import com.lawyer.model.ERole;
import com.lawyer.model.EmailInfo;
import com.lawyer.model.LoginDateTimeIPEntity;
import com.lawyer.model.PatientDetails;
import com.lawyer.model.Role;
import com.lawyer.model.User;
import com.lawyer.payload.request.JwtResponseDTO;
import com.lawyer.payload.request.LoginRequest;
import com.lawyer.payload.request.RefreshTokenRequestDTO;
import com.lawyer.payload.request.SignupRequest;
import com.lawyer.payload.response.JwtResponse;
import com.lawyer.payload.response.MessageResponse;
import com.lawyer.repository.ConversationAdminMaintainanceRepository;
import com.lawyer.repository.PatientRepository;
import com.lawyer.repository.RoleRepository;
import com.lawyer.repository.UserRepository;
import com.lawyer.security.jwt.JwtUtils;
import com.lawyer.security.services.UserDetailsImpl;
import com.lawyer.service.AuthService;
import com.lawyer.service.UserService;
import com.lawyer.utils.ExamtoolConstants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
//	private LoginDateTimeIPService dateTimeService;

	private ObjectMapper mapper = new ObjectMapper();
	private Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserService userService;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	DecryptPassword decryptPassword;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	private AuthService authService;
	
	@Autowired
	private ConversationAdminMaintainanceRepository conversationAdminMaintainanceRepository;
	
	@Autowired
	private PatientRepository patientRepository;
	

	@Value("${collegeName}")
	private String collegeName;

	/*****************
	 * sign in method
	 *****************/
	

	
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request)
			throws JsonProcessingException {

		getRequestHeadersInMap(request);

		logHttpServletRequest(request);

		/*
		 * Password decrypt
		 */
//		loginRequest.setPassword(decryptPassword.passwordDecryption(loginRequest.getPassword()));
//		logger.info("user details====>" + request.getRemoteHost());
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
//		Authentication item3 = SecurityContextHolder.getContext().getAuthentication();
		Boolean ipStatus = jwtUtils.authenticateIp(request.getRemoteHost());
		logger.info("ipStatus ==> " + ipStatus);
		String jwt = "";
//		if (authentication.isAuthenticated() && ipStatus) {
		if (authentication.isAuthenticated()) {
			jwt = jwtUtils.createRefreshToken(loginRequest.getUsername());
		} else {
			throw new UsernameNotFoundException("Invalid User/IP request..!!");
		}
//		String jwt = jwtUtils.generateJwtToken(authentication);
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		// For Front end requirments ==>
//		userDetails.setCollegeId(collegeName);
		// <==
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());
//		String ipAddress = loginRequest.getIpAddress();
		try {
//			if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
//				ipAddress = request.getHeader("X-Real-IP");
//			}
//			// If no forwarded headers are present, fallback to the remote address
//			if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
//				ipAddress = request.getRemoteAddr();
//			}
//			dateTimeService.saveLoginDetailsHistory(ipAddress, loginRequest.getUsername());
//			sendEmailWhileLogin(userDetails, ipAddress);
			
			logger.info("User Details ~>"+mapper.writeValueAsString(userDetails));

			String doctorId = null;
			String fullName = null;
			if (userDetails != null && userDetails.getEmail() != null) {
				ConversationAdminMaintainance byEmail = conversationAdminMaintainanceRepository
						.getOneRecordByEmail(userDetails.getEmail());
				logger.info("Admin Users ~>"+mapper.writeValueAsString(byEmail));
				logger.info("userDetails.getEmail() ~>"+userDetails.getEmail());

				PatientDetails patient = patientRepository.getPatientDetails(userDetails.getEmail());
				logger.info("Patient Details ~>"+mapper.writeValueAsString(patient));

				if (byEmail != null) {
					doctorId = byEmail.getId();
					fullName = byEmail.getUsername();
				}else if (patient != null) {
					doctorId = patient.getUhid();
					fullName = patient.getPatientName();
					logger.info("Doctor Id ~>" + mapper.writeValueAsString(doctorId));
				} else {
					User patientData = userRepository.getUserDetails(userDetails.getUsername(),userDetails.getEmail());
					doctorId="";
					fullName=patientData.getPatientName();
					
					logger.info("Patient Full Name ~>"+fullName);
					
				}

			}

			JwtResponse jwtResponse = new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
					userDetails.getEmail(), roles, userDetails.getDepartment(), doctorId,fullName);
			logger.info("signin return back data ===>" + mapper.writeValueAsString(jwtResponse));
			return ResponseEntity.ok(jwtResponse);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	private void getRequestHeadersInMap(HttpServletRequest request) throws JsonProcessingException {
		Map<String, String> result = new HashMap<>();
		Enumeration headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String key = (String) headerNames.nextElement();
			String value = request.getHeader(key);
			result.put(key, value);
		}
	}

public void logHttpServletRequest(HttpServletRequest request) {
	    Enumeration<String> headerNames = request.getHeaderNames();
	    while (headerNames.hasMoreElements()) {
	        String headerName = headerNames.nextElement();
	    }
	   
	    Map<String, String[]> parameterMap = request.getParameterMap();
	    for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
	    }
	    Enumeration<String> attributeNames = request.getAttributeNames();
	    while (attributeNames.hasMoreElements()) {
	        String attributeName = attributeNames.nextElement();
	        logger.info(attributeName + ": " + request.getAttribute(attributeName));
	    }
	}
	
	
//	@PostMapping("/signin")
//	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request)
//			throws JsonProcessingException {
//
//		logger.info("signin entered data front===>" + mapper.writeValueAsString(loginRequest));
//
//		/*
//		 * Password decrypt
//		 */
//		loginRequest.setPassword(decryptPassword.passwordDecryption(loginRequest.getPassword()));
//
//		logger.info("user details====>" + request.getRemoteHost());
//		Authentication authentication = authenticationManager.authenticate(
//				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//		logger.info("Raw password before decryption: " + loginRequest.getPassword());
//
//		SecurityContextHolder.getContext().setAuthentication(authentication);
////		Authentication item3 = SecurityContextHolder.getContext().getAuthentication();
//
//		Boolean ipStatus = jwtUtils.authenticateIp(request.getRemoteHost());
//		logger.info("ipStatus ==> " + ipStatus);
//
//		String jwt = "";
////		if (authentication.isAuthenticated() && ipStatus) {
//		if (authentication.isAuthenticated()) {
//			jwt = jwtUtils.createRefreshToken(loginRequest.getUsername());
//		} else {
//			throw new UsernameNotFoundException("Invalid User/IP request..!!");
//		}
//
////		String jwt = jwtUtils.generateJwtToken(authentication);
//
//		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//
//	
//		// <==
//		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
//				.collect(Collectors.toList());
//		String ipAddress = loginRequest.getIpAddress();
//		try {
//			if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
//				ipAddress = request.getHeader("X-Real-IP");
//			}
//
//			// If no forwarded headers are present, fallback to the remote address
//			if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
//				ipAddress = request.getRemoteAddr();
//			}
//			dateTimeService.saveLoginDetailsHistory(ipAddress, loginRequest.getUsername());
//			sendEmailWhileLogin(userDetails, ipAddress);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		JwtResponse jwtResponse = new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
//				userDetails.getEmail(), roles, 
//				userDetails.getDepartment());
//
//		logger.info("signin return back data ===>" + mapper.writeValueAsString(jwtResponse));
//		return ResponseEntity.ok(jwtResponse);
//	}

//--------------------------------------User Registration--------------------------------------------------------------------

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest)
			throws JsonProcessingException {
		logger.info("signup entered data front===>" + mapper.writeValueAsString(signUpRequest));

		List<User> existOrNot = userRepository.getCOERoleExistsOrNot();

		logger.info("existOrNot===========>" + mapper.writeValueAsString(existOrNot));

//		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
//		}
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		}
		// Create new user's account
		User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()), signUpRequest.getDepartment(), "",
				signUpRequest.getPatientName(), signUpRequest.getDob(), signUpRequest.getMobile());

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();
		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_END_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "hospitaladmin":
					Role hospitaladminRole = roleRepository.findByName(ERole.ROLE_HOSPITAL_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(hospitaladminRole);

					break;
				case "ambulance":
					Role ambulanceRole = roleRepository.findByName(ERole.ROLE_AMBULANCE)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(ambulanceRole);

					break;
				case "doctor":
					Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(doctorRole);

					break;
				case "certificate":
					Role certificateRole = roleRepository.findByName(ERole.ROLE_CERTIFICATE)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(certificateRole);

					break;
				case "accounts":
					Role accountRole = roleRepository.findByName(ERole.ROLE_ACCOUNTS)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(accountRole);

					break;
				case "nurse":
					Role nurseRole = roleRepository.findByName(ERole.ROLE_NURSE)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(nurseRole);

					break;
				case "wards":
					Role wardsRole = roleRepository.findByName(ERole.ROLE_WARDS)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(wardsRole);

					break;
				case "receptionist":
					Role receptionist = roleRepository.findByName(ERole.ROLE_RECEPTIONIST)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(receptionist);
					break;

				case "patient":
					Role patient = roleRepository.findByName(ERole.ROLE_PATIENT)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(patient);
					break;

				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_END_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
				}
			});
		}
		user.setRoles(roles);
		logger.info("user==>" + mapper.writeValueAsString(user));
		User user2 = userRepository.save(user);
		logger.info("signup return back data===>" + mapper.writeValueAsString(user2));
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
	
	
	@PostMapping("/sendOtpToEmailAuthetication")
	public ResponseEntity<String> sendOtp(@RequestParam Map<String, String> allParams) {
		String msg = "";
		try {
			logger.info("sendOtpToEmailAuthetication contrller====>" + allParams);

			if (allParams.get("email").isEmpty()) {
				logger.info("email address ==> " + allParams.get("email"));
//				msg = ;
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please Enter email");
			} else {
				authService.sendOtp(allParams);
				return ResponseEntity.status(HttpStatus.OK).body("OTP sent to your email.");
			}
//			return ResponseEntity.ok(msg);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	@PostMapping("/verifyEmailForAuthentication")
	public ResponseEntity<String> verifyOtp(@RequestParam Map<String, String> allParams) {

		boolean isVerified = false;
		try {

			isVerified = authService.verifyOtp(allParams);
			logger.info("isVerified===>" + isVerified);
			if (isVerified) {
				return ResponseEntity.ok("OTP verified successfully.");

			} else {

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	
	

	/*****************
	 * sign out method
	 *****************/
	@PostMapping("/signout")
	public ResponseEntity<?> logoutUser() throws JsonProcessingException {
		logger.info("signout entered front===>");
		ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
		logger.info("signout return back data===>" + mapper.writeValueAsString(cookie));
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
				.body(new MessageResponse("You've been signed out!"));
	}

	/***********************
	 * is user exists method -
	 *****/
	@PostMapping(value = "/isUserExist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> isUserExist(@RequestPart(name = "loginRequest") LoginRequest loginRequest) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			logger.info("isUserExist entered data front===>" + mapper.writeValueAsString(loginRequest));
			logger.info(" data from front end is ===> " + mapper.writeValueAsString(loginRequest));
			logger.info(" User name is ===> " + loginRequest.getUsername());
			String userExists = "User not available";
			if (userRepository.existsByUsername(loginRequest.getUsername())) {
				String user = loginRequest.getUsername();
				logger.info(" User Name is =====> " + user);
				userExists = "User availble";
			}
			logger.info("isUserExist return back data===>" + mapper.writeValueAsString(userExists));
			return ResponseEntity.ok().body(new MessageResponse(userExists));
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("isUserExistexception raised===>");
		}
		return ResponseEntity.ok().body(null);
	}

	/*********************
	 * reset user password
	 *********************/
	@PostMapping(value = "/resetUserPassword", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> resetUserPassword(@RequestPart LoginRequest loginRequest) {
		try {
			logger.info("resetUserPassword entered data front===>" + mapper.writeValueAsString(loginRequest));
			logger.info("data from front end is ====> " + mapper.writeValueAsString(loginRequest));
			if (userRepository.existsByUsername(loginRequest.getUsername())) {
				logger.info(" user name is ====>" + loginRequest.getUsername());
				Object userPassword = userService.resetUserPassword(loginRequest);
				logger.info(" userPassword is ====>  " + userPassword);
			}
			logger.info("resetUserPassword return data===>" + mapper.writeValueAsString("Password has been changed !"));
			return ResponseEntity.ok().body(new MessageResponse("Password has been changed !"));
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("resetUserPassword exception raised");
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
	}

	/*************************
	 * LOGIN DETAILS DATE CAL
	 *************************/
	@GetMapping("/getallDates")
	public ResponseEntity<List<LoginDateTimeIPEntity>> getalldates(@RequestParam Map<String, String> allmaps) {

		List<LoginDateTimeIPEntity> logindata = null;
		try {
			logger.info("getallDates entered data front===>" + mapper.writeValueAsString(allmaps));
//			logindata = dateTimeService.getAlldatesdata(allmaps);
			logger.info("getallDates entered data front===>" + mapper.writeValueAsString(logindata));
			return ResponseEntity.status(HttpStatus.OK).body(logindata);

		} catch (JsonProcessingException e) {
			e.printStackTrace();
			logger.info("getallDates exception raised===>");
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	}

	/****************
	 * Reset Password
	 ****************/
	@PostMapping(value = "/resetUserPassword")
	public ResponseEntity<Object> resetUserPassword(@RequestBody Map<String, String> loginRequest) {
		try {
			Object object = null;
			logger.info("resetUserPassword entered data front===>" + mapper.writeValueAsString(loginRequest));
			if (userRepository.existsByUsername(loginRequest.get("username"))) {
				logger.info(" user name is ====>" + loginRequest.get("username"));
				object = userService.resetUserPassword(loginRequest);
			} else {
				Map<String, Object> returndata = new LinkedHashMap<>();
				returndata.put("status", false);
				returndata.put("message", "User not found..");
				returndata.put("user", loginRequest.get("username"));
				object = returndata;
			}
			logger.info("resetUserPassword return back data===>" + mapper.writeValueAsString(object));

			return ResponseEntity.ok().body(object);
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("resetUserPassword exception raised=====>");
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
	}

	/******************
	 * Forget Password
	 ******************/
	@PostMapping(value = "/forgetUserPassword")
	public ResponseEntity<Object> forgetUserPassword(@RequestBody Map<String, String> loginRequest) {
		try {
			logger.info("forgetUserPassword entered data front===>" + mapper.writeValueAsString(loginRequest));
			if (userRepository.existsByEmail(loginRequest.get("emailId"))) {
				logger.info(" user name is ====>" + loginRequest.get("emailId"));
				Object object = userService.forgetUserPassword(loginRequest);
				logger.info("forgetUserPassword return back data ===>" + mapper.writeValueAsString(object));
				return ResponseEntity.ok().body(object);
			} else {
				Map<String, Object> returndata = new LinkedHashMap<>();
				returndata.put("status", false);
				returndata.put("message", "User not found..");
				returndata.put("user", loginRequest.get("emailId"));
				logger.info("forgetUserPassword return back data ===>" + mapper.writeValueAsString(returndata));
				return ResponseEntity.ok().body(returndata);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("forgetUserPassword exception raised=====>");
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
	}

	/******************
	 * Forget Password
	 ******************/
	@PostMapping(value = "/authorizeSecretCode")
	public ResponseEntity<Object> authorizeSecretCode(@RequestBody Map<String, String> loginRequest) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			logger.info("authorizeSecretCode data from front end is ====> " + mapper.writeValueAsString(loginRequest));
			if (userRepository.existsByEmail(loginRequest.get("emailId"))) {
				logger.info(" user name is ====>" + loginRequest.get("emailId"));
				Object object = userService.authorizeSecretCode(loginRequest);
				logger.info("authorizeSecretCode data from back end is ====> " + mapper.writeValueAsString(object));
				return ResponseEntity.ok().body(object);
			} else {
				Map<String, Object> returndata = new LinkedHashMap<>();
				returndata.put("status", false);
				returndata.put("message", "User not found..");
				returndata.put("user", loginRequest.get("emailId"));
				logger.info("authorizeSecretCode data from back end is ====> " + mapper.writeValueAsString(returndata));
				return ResponseEntity.ok().body(returndata);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
		}
	}

	private void sendEmailWhileLogin(UserDetailsImpl userDetails, String ipAddress) {
		try {
			EmailInfo emailInfo = new EmailInfo();
			emailInfo.setTo(userDetails.getEmail());
			emailInfo.setSubject("Logged In from the IP Address :" + ipAddress);
			emailInfo.setBody("Dear User, You have been logged In from the System IP Address is :" + ipAddress);

			// kafkaProducer.sendMessage(emailInfo);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/allusersloginData")
	public ResponseEntity<Object> getAllusersloginData(@RequestParam Map<String, String> allparams) {
		try {
			logger.info("allusersloginData entered front data===>" + allparams);
			Object data = userService.getAllusersloginData(allparams);
			logger.info("allusersloginData entered back data===>" + mapper.writeValueAsString(data));
			return ResponseEntity.status(HttpStatus.OK).body(data);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
		}

	}
	

	@DeleteMapping("/deleteuserdata")
	public ResponseEntity<String> deleteuserdata(@RequestBody User user) {
		logger.info("call trigerred ===========>");
		String returnObj = userService.deltekeyvalue(user);
		return ResponseEntity.status(HttpStatus.OK).body(returnObj);
	}

	/***************************
	 * Refresh token by token
	 ***************************/
	@PostMapping("/refreshToken")
	public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {

		try {

//			logger.info("refreshToken entered==>" + mapper.writeValueAsString(refreshTokenRequestDTO));

			String tokenStatus = jwtUtils.validateJwtToken(refreshTokenRequestDTO.getToken());

//			logger.info("tokenStatus after==>" + (tokenStatus));

			switch (tokenStatus) {
			case ExamtoolConstants.jwt_token_expired -> {
				JwtResponseDTO jwtResponsedto = new JwtResponseDTO();
				jwtResponsedto.setAccessToken(jwtUtils.createRefreshToken(refreshTokenRequestDTO.getUsername()));
				jwtResponsedto.setToken(refreshTokenRequestDTO.getToken());
				logger.info("tokenStatus after expire==>" + (tokenStatus));
				return jwtResponsedto;
			}
			case ExamtoolConstants.jwt_token_valid -> {
//				logger.info("tokenStatus after valid==>" + (tokenStatus) + " Expired date==>"
//						+ (jwtUtils.getExpirationDateFromToken(refreshTokenRequestDTO.getToken()).toString())
//						+ "==>username==>"
//						+ (jwtUtils.getUserNameFromJwtToken(refreshTokenRequestDTO.getToken()).toString()));
				JwtResponseDTO jwtResponsedto = new JwtResponseDTO();
				jwtResponsedto.setAccessToken(refreshTokenRequestDTO.getToken());
				jwtResponsedto.setToken(refreshTokenRequestDTO.getToken());
				logger.info("tokenStatus after valid==>" + (tokenStatus));
				return jwtResponsedto;
			}
			case ExamtoolConstants.jwt_token_malformed -> {
//				throw new MalformedJwtException("Requested token isn't a valid JWT token.....!");
				JwtResponseDTO jwtResponsedto = new JwtResponseDTO();
				jwtResponsedto.setAccessToken(jwtUtils.createRefreshToken(refreshTokenRequestDTO.getUsername()));
				jwtResponsedto.setToken(refreshTokenRequestDTO.getToken());
				logger.info("tokenStatus after expire==>" + (tokenStatus));
				return jwtResponsedto;
			}
			case ExamtoolConstants.jwt_token_unsupported -> {
//				throw new UnsupportedJwtException("Requested token isn't suported JWT token.....!");
				JwtResponseDTO jwtResponsedto = new JwtResponseDTO();
				jwtResponsedto.setAccessToken(jwtUtils.createRefreshToken(refreshTokenRequestDTO.getUsername()));
				jwtResponsedto.setToken(refreshTokenRequestDTO.getToken());
				logger.info("tokenStatus after expire==>" + (tokenStatus));
				return jwtResponsedto;
			}
			default -> {
				throw new IllegalArgumentException("Unexpected value: " + tokenStatus);
			}

			}
		} catch (Exception e) {
			logger.error("Exception in Refresh token method===>", e);
			return null;
		}
	}

	// login deletion based on user_name and email and role
	@DeleteMapping("/deleteLogin")
	public String deleteLogin(@RequestParam Map<String, String> allparams) throws Throwable {
		logger.info("data from frontend to delete user login====>" + allparams);
		String message = "";
		try {
			message = userService.deleteLogin(allparams);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return message;
	}
	
	/**
	 * Getting all roles from Roles
	 */
	
	
	@GetMapping("/getAllRoles")
	public ResponseEntity<List<String>> getAllRoles() {
		List<String> roles = new LinkedList<>();
		try {
			logger.info("get All roles triggered=====================>");
			roles = userService.getListOfRoles();
			if (roles != null)
				return ResponseEntity.ok().body(roles);
			else
				return ResponseEntity.badRequest().body(roles);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}
	
	/**
	 * Password creation for roles
	 */
	
	@GetMapping("/checkingEmailStatus")
	public ResponseEntity<Object> checkingEmaiStatus(@RequestParam("email") String email) {
		Object msg = "";
		try {
			logger.info("front end ~>" + email);
			if (email != null)
				msg = authService.checkingEmaiStatus(email);

			if (msg != null)
				return ResponseEntity.ok().body(msg);
			else
				return ResponseEntity.internalServerError().body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(msg);
		}
	}
	
	
	@PutMapping("/setPassword")
	public ResponseEntity<Object> setPassword(@RequestBody User user) {
		Object msg = "";
		try {
			logger.info("Users details from front end ~>" + mapper.writeValueAsString(user));
			if (user != null)
				msg = authService.setPassword(user);

			if (msg != null)
				return ResponseEntity.ok().body(msg);
			else
				return ResponseEntity.internalServerError().body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(msg);
		}
	}
	
	
}
