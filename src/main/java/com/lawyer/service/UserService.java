package com.lawyer.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.ERole;
import com.lawyer.model.Role;
import com.lawyer.model.User;
import com.lawyer.payload.request.LoginRequest;
import com.lawyer.repository.RoleRepository;
import com.lawyer.repository.UserRepository;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

	private final Logger logger = LoggerFactory.getLogger(UserService.class);
	ObjectMapper mapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

//	@Autowired
//	private AutoRemainder autoRemainder;

	@Autowired
	PasswordEncoder encoder;

	public List<User> getAllUserRecords() {
		try {
			List<User> userRecords = new ArrayList<User>();

			userRepository.findAll().forEach(userRecords::add);
			logger.info("the userrecords data is===>" + mapper.writeValueAsString(userRecords));

			return userRecords;

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public List<User> getUsersList(Map<String, String> allParams) {
		try {
			List<User> userDetails = userRepository.getUsersList(allParams.get("collegeId"),
					allParams.get("typeofInstitution"));
			logger.info("the userlist data is===>" + mapper.writeValueAsString(userDetails));
			return userDetails;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public String userDetialsModify(User user) {

		try {
			userRepository.save(user);
			return "SUCCESS";
		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR";
		}

	}

	public String deleteUserDeteils(int id) {
		try {

			int delectUsersRole = userRepository.delectUsersRole(id);
			if (delectUsersRole > 0) {
				userRepository.delectUsers(id);
			}
			return "SUCCESS";
		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR";
		}

	}

	public List<User> mailInfo() {
		List<User> userInfo = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		try {
			userInfo = userRepository.userInfo();
			logger.info("id ===>" + mapper.writeValueAsString(userInfo));
			// System.out.println("id ===>"+mapper.writeValueAsString(userInfo));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userInfo;

	}

	// Reset Password

	public Object resetUserPassword(@RequestParam LoginRequest loginRequest) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			logger.info(" data from front end is ===> " + mapper.writeValueAsString(loginRequest));
			// System.out.println(" data from front end is ===>
			// "+mapper.writeValueAsString(loginRequest));
			String pswd = encoder.encode(loginRequest.getPassword());

			Optional<User> exists = userRepository.findByUsername(loginRequest.getUsername());
			if (exists.isPresent() && encoder.matches(loginRequest.getPassword(), exists.get().getPassword())) {

			}

			int a = userRepository.resetPassword(pswd, loginRequest.getUsername());
			logger.info(" userPswd is ====> " + mapper.writeValueAsString(a));
			// System.out.println(" userPswd is ====>
			// "+mapper.writeValueAsString(userPswd));
			return a;
		} catch (Exception e) {

			e.printStackTrace();
		}
		return null;
	}

	// Reset Password

	public Object resetUserPassword(Map<String, String> loginRequest) {

		Map<String, Object> returndata = new LinkedHashMap<>();
		try {
			logger.info(" data from front end is ===> " + mapper.writeValueAsString(loginRequest));
			String pswd = encoder.encode(loginRequest.get("password"));
//				String oldPsw = encoder.encode(loginRequest.get("oldpassword"));

			Optional<User> exists = userRepository.findByUsername(loginRequest.get("username"));
//				logger.info(oldPsw +" -- "+exists.get().getPassword());
			logger.info("match == >" + encoder.matches(loginRequest.get("oldpassword"), exists.get().getPassword()));
			if (exists.isPresent() && encoder.matches(loginRequest.get("oldpassword"), exists.get().getPassword())) {
				logger.info("matched entered======>");
				int a = userRepository.resetPassword(pswd, loginRequest.get("username"));
				logger.info("matched crossed======>" + a);
				returndata.put("status", true);
				returndata.put("message", "Password changed successfully..");
				returndata.put("user", loginRequest.get("username"));
				logger.info("response=====>" + mapper.writeValueAsString(returndata));
				return returndata;

			} else {
				returndata.put("status", false);
				returndata.put("message", "Old password did't matched..");
				returndata.put("user", loginRequest.get("username"));
				logger.info("response=====>" + mapper.writeValueAsString(returndata));
				return returndata;
			}

		} catch (Exception e) {

			e.printStackTrace();
		}
		return null;
	}

	public Object forgetUserPassword(Map<String, String> loginRequest) {
		Map<String, Object> returndata = new LinkedHashMap<>();
//		try {
//			String result = autoRemainder.sendScretCodeForForgetPassword(loginRequest.get("emailId"));
//			logger.info("generated code for forget password=====>" + result);
//
//			if (result != null && result.length() > 0) {
//
//				String pswd = encoder.encode(result);
//
//				int a = userRepository.updatePasswordForForget(loginRequest.get("emailId"), pswd);
//				logger.info("updated records=====>" + a);
//
//				if (a > 0) {
//					returndata.put("status", true);
//					returndata.put("message", "Password sent successfully..");
//					returndata.put("user", loginRequest.get("emailId"));
//					logger.info("Reponse=====>" + mapper.writeValueAsString(returndata));
////					return returndata;
//				} else {
//					returndata.put("status", false);
//					returndata.put("message", "Password sent failed..");
//					returndata.put("user", loginRequest.get("emailId"));
//					logger.info("Reponse=====>" + mapper.writeValueAsString(returndata));
////					return returndata;
//				}
//
//			} else {
//				returndata.put("status", false);
//				returndata.put("message", "Password sent failed..");
//				returndata.put("user", loginRequest.get("emailId"));
//				logger.info("Reponse=====>" + mapper.writeValueAsString(returndata));
////				return returndata;
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			returndata.put("status", false);
//			returndata.put("message", "Password sent failed..");
//			returndata.put("user", loginRequest.get("emailId"));
//		}
//		return returndata;
		return null;
	}

	public Object authorizeSecretCode(Map<String, String> loginRequest) {

		return null;
	}

	public Object getAllusersloginData(Map<String, String> allparams) {
		try {
			// write logic here.....

			List<User> userList = userRepository.getAllusersloginData(allparams.get("userRole"));

			logger.info("userList from db========>" + mapper.writeValueAsString(userList));

			return userList;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public String deltekeyvalue(User user) {
		try {
			userRepository.deleteById(user.getId());
			return "User Deleted Successfully..";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "User Deletion Failed..!";
	}

	public String deleteLogin(Map<String, String> allparams) {
		// TODO Auto-generated method stub
		try {
			String userName = allparams.get("userName");
			String email = allparams.get("email");

			List<User> users = userRepository.getUserByEmailAnduserName(userName, email);
			if (users.size() == 1) {

				// delete from user_roles
				userRepository.deleteById(users.get(0).getId());
				logger.info("response of user deletion");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "User Deletion Failed..!";
	}

	public List<String> getListOfRoles() {
		try {
			String[] allRoles = roleRepository.getAllRoles();
			List<String> listOfRoles = Arrays.asList(allRoles);

			logger.info("listOfRoles~>" + mapper.writeValueAsString(listOfRoles));
			if (listOfRoles != null) {

				List<String> filteredRoles = listOfRoles.stream()
						.filter(role -> role.equalsIgnoreCase("ROLE_WARDS") || role.equalsIgnoreCase("ROLE_DOCTOR")
								|| role.equalsIgnoreCase("ROLE_NURSE") || role.equalsIgnoreCase("ROLE_RECEPTIONIST"))
						.collect(Collectors.toList());

				return filteredRoles;

			} else {
				logger.info("list of roles ~>" + mapper.writeValueAsString(listOfRoles));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
