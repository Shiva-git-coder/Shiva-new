package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lawyer.model.PatientDetails;
import com.lawyer.model.PatientResponse;
import com.lawyer.payload.response.PatientHistory;

import jakarta.transaction.Transactional;

@Repository
public interface patientResponseRepository extends JpaRepository<PatientResponse, Long> {

	//this is for conversation query

	@Query(value = "SELECT pi.uhid, pi.patient_name, pi.dob \r\n"
			+ "FROM patient_information pi \r\n"
			+ "JOIN doctor_patient_maping dpm ON pi.uhid = dpm.patient_uhid \r\n"
			+ "WHERE dpm.dateval::DATE = CAST(?1 AS DATE) AND dpm.doctor_id = ?2  AND dpm.mark_as_completed_status='non completed'\r\n"
			+ "ORDER BY dpm.dateval\r\n", nativeQuery = true)
	 List<String> getPatientSpecificInfo(String datevall, String doctorids);
	
	
	
	//this query for all patient details based on doctor id  for doctor admin screen
	
	
	@Query(value = "SELECT pi.uhid, pi.patient_name, pi.dob " +
            "FROM patient_information pi " +
            "JOIN doctor_patient_maping dpm ON pi.uhid = dpm.patient_uhid " +
            "WHERE dpm.doctor_id = ?1 " +
            "ORDER BY dpm.dateval DESC", 
    nativeQuery = true)
List<String> getAllPatientsByDoctorId(String doctorId);

	
//count the patients number of patients appointed today
	
	@Query(value = "SELECT COUNT(pi.uhid) " +
            "FROM patient_information pi " +
            "JOIN doctor_patient_maping dpm ON pi.uhid = dpm.patient_uhid " +
            "WHERE dpm.dateval::DATE = CAST(?1 AS DATE) AND dpm.doctor_id = ?2", 
    nativeQuery = true)
int countNumberOfPatientsThisDayNotUsingOldCode(String dateVal, String doctorid);

	
	@Query(value = "SELECT COUNT(uhid)  FROM patient_information WHERE dates=?1 AND doctor_id = ?2", nativeQuery = true)
    int countNumberOfPatientsThisDay(String dateVal, String doctorid);

////count number of patients appointed overall
//	@Query(value = "SELECT COUNT(pi.uhid) " +
//            "FROM patient_information pi " +
//            "JOIN doctor_patient_maping dpm ON pi.uhid = dpm.patient_uhid " +
//            "WHERE dpm.doctor_id = ?", 
//    nativeQuery = true)
//int countNumberOfPatientsOverall(String doctorid);
	
	
	@Query(value = "select * from doctor_patient_maping where doctor_id=?1 and assigned_date=?2 and mark_as_completed_status ='Progress'", nativeQuery = true)
	List<PatientResponse> getPatientBasedOnCurrentDate(String doctorEmail, String currentDate);

	@Modifying
	@Transactional
	@Query(value = "update doctor_patient_maping set mark_as_completed_status=?1 where patient_id=?2",nativeQuery = true)
	int updatePatientStatus(String status,String patientId);


	@Query(value = "select * from doctor_patient_maping where doctor_id=?1 and assigned_date=?2 and mark_as_completed_status in (?3) ",nativeQuery = true)
	List<PatientResponse> getCompletedPatientsByDate(String doctorId, String currentDate,String status);
	
	@Query(value = "select * from doctor_patient_maping where doctor_id=?1 and assigned_date<?2 and mark_as_completed_status in (?3)",nativeQuery = true)
	List<PatientResponse> patientsHistoryWithoutCurrent(String doctorId, String currentDate,String status);


	@Query(value = "select exists( select * from doctor_patient_maping where patient_id=?1) ",nativeQuery = true)
	boolean getPatientById(String patientId);
	
	@Query(value = "select * from doctor_patient_maping where patient_id=?1",nativeQuery = true)
	PatientResponse fetchPatientById(String patientId);

	@Query(value = "select * from doctor_patient_maping where receptionist_id=?1 and mark_as_completed_status ='Completed'",nativeQuery = true)
	List<PatientResponse> getCompletedPatientsList(String receptionistId);
	

	@Query(value = "select count(*) from doctor_patient_maping where doctor_id= ?1",nativeQuery = true)
	int countNumberOfPatientsOverall(String doctorid);	
	
	@Query(value ="select count(*) from doctor_patient_maping where doctor_id=?1 and mark_as_completed_status='Progress' ",nativeQuery = true)
	int progressPatientsCount(String doctorid);

	@Transactional
	@Modifying
	 @Query("DELETE FROM PatientResponse e WHERE e.patientId = :patientId")
	int deleteByPatientId(String patientId);
	
	@Query(value = "select * from doctor_patient_maping where patient_id=?1 and mark_as_completed_status='Completed' ",nativeQuery = true)
	List<PatientResponse> getMyReports(String patientId);
		
}
