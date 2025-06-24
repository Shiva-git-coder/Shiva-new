package com.lawyer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.lawyer.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);

	/*
	 * GETTING USERS STATUS
	 */
	@Query(value = "SELECT EXISTS(select * from users where username=?1 and users_status='ACTIVE')", nativeQuery = true)
	Boolean userstatus(String username);

	@Query(value = "SELECT EXISTS(select * from users where (username=?1 or email=?1))", nativeQuery = true)
	Boolean userByEmail(String email);

	/*
	 * GETTING THE USER INFORMATION
	 */

	@Modifying
	@Transactional
	@Query(value = "select u.* from users u,user_roles ur,roles r where u.id = ur.user_id and ur.role_id = r.id and r.name != 'ROLE_QUALITYADVISOR'", nativeQuery = true)
	List<User> userInfo();

	/*
	 * RESETING THE PASSWORD
	 */

	@Modifying
	@Transactional
	@Query(value = "update users set password=?1 where username=?2", nativeQuery = true)
	int resetPassword(String val1, String val2);

	/*
	 * DELETEING THE USER ROLE
	 */

	@Modifying
	@Transactional
	@Query(value = "delete from user_roles where user_id=?1", nativeQuery = true)
	int delectUsersRole(int id);

	/*
	 * DELETEING THE USERS
	 */

	@Modifying
	@Transactional
	@Query(value = "delete from users where id=?1 ", nativeQuery = true)
	int delectUsers(int id);

	/*
	 * getting user list
	 */

	@Modifying
	@Transactional
	@Query(value = "select u.* from users u,user_roles ur,roles r where u.id = ur.user_id and ur.role_id = r.id  and u.eamcet_code=?1 and u.institute_type=?2", nativeQuery = true)
	List<User> getUsersList(String collegecode, String typeOfInstitute);

	@Query(value = "select  user_id from user_roles ur JOIN roles r  on r.id=ur.role_id where r.name='ROLE_VALUATION' ", nativeQuery = true)
	String[] getValuatorsList();

	@Query(value = "SELECT email from users where id=?1 ", nativeQuery = true)
	String[] getValuatorEmail(int id);

	@Query(value = "select distinct college_name from users", nativeQuery = true)
	String[] getCollegeNameForOBE();

	@Query(value = "select distinct eamcet_code, institute_type from users", nativeQuery = true)
	String[] getCollegeDataForOBE();

	@Query(value = "select distinct eamcet_code, institute_type, college_name from users", nativeQuery = true)
	String[] getCollegeDetailsForOBE();

	@Query(value = "select * from users where id IN (select DISTINCT user_id from user_roles where role_id=(select DISTINCT id from roles where name='ROLE_EXAMINATION' limit 1)) and departmentname=?1", nativeQuery = true)
	List<User> getFacultyDetails(String department);

	@Query(value = "select distinct email from users where email=?1 ", nativeQuery = true)
	String[] getCoeEmail(String email);

	@Query(value = "select * from users where id=(select Distinct user_id from user_roles ur join roles r on  r.id=ur.role_id where r.name='ROLE_COE' limit 1)", nativeQuery = true)
	List<User> getCOEdetails();

	@Query(value = "select * from users where id=(select Distinct user_id from user_roles ur join roles r on  r.id=ur.role_id where r.name='ROLE_VALUATION')", nativeQuery = true)
	List<User> getValuatordetails();

	@Query(value = "select * from users where email=?1 ", nativeQuery = true)
	List<User> getValuatorData(String email);

	@Modifying
	@Transactional
	@Query(value = "update users set password=?2 where email=?1", nativeQuery = true)
	int updatePasswordForForget(String string, String pswd);

	@Query(value = "select * from users where id=(select Distinct user_id from user_roles ur join roles r on  r.id=ur.role_id where r.name='ROLE_FACULTY' limit 1)", nativeQuery = true)
	List<User> getFacultydetails();

	@Query(value = "SELECT DISTINCT u.*\r\n" + "FROM users u\r\n" + "JOIN user_roles ur ON u.id = ur.user_id\r\n"
			+ "JOIN roles r ON ur.role_id = r.id\r\n"
			+ "WHERE r.name IN ('ROLE_FACULTY','ROLE_HOD');", nativeQuery = true)
	List<User> getAllFacultyDetails();

	@Query(value = "select * from users where id IN (select DISTINCT user_id from user_roles where role_id=(select DISTINCT id from roles where name=?1 limit 1))", nativeQuery = true)
	List<User> getAllusersloginData(String string);

	@Query(value = "select * from users where id IN (select DISTINCT user_id from user_roles where role_id=(select DISTINCT id from roles where name=?1 limit 1)) limit 1", nativeQuery = true)
	User getUserByRole(String role);

	User findByEmail(String userEmail);

	@Modifying
	@Transactional
	@Query(value = "delete from user_roles where user_id in (select DISTINCT id from users where email=?1 and username=?2)", nativeQuery = true)
	int delectUsersRole(String email, String username);

	@Modifying
	@Transactional
	@Query(value = "delete from users where email=?1 and username=?2", nativeQuery = true)
	int delectUsersByEmailID(String email, String username);

	@Query(value = "select * from users where id IN (select DISTINCT user_id from user_roles where role_id=(select DISTINCT id from roles where name='ROLE_COE') limit 1)", nativeQuery = true)
	List<User> getCOERoleExistsOrNot();

	/*
	 * get Email form users
	 */
	@Query(value = "select email from users where  username = ?1 ", nativeQuery = true)
	String getEmail(String userName);

	@Query(value = "select * from users where username = ?1 and email=?2", nativeQuery = true)
	List<User> getUserByEmailAnduserName(String userName, String email);

	@Query(value="select exists (select * from users where email=?1)",nativeQuery = true)
	boolean userData(String email);
	

	@Query(value = " select exists( select * from users where username =?1 )", nativeQuery = true)
	boolean existingOrNot(String username);
	
	
	@Query(value = "select * from users where username = ?1 and email=?2", nativeQuery = true)
	User getUserDetails(String userName, String email);

}
