package com.lawyer.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lawyer.model.EmbededPatientDetails;
import com.lawyer.model.PatientDetails;

import jakarta.transaction.Transactional;

public interface PatientRepository extends JpaRepository<PatientDetails, EmbededPatientDetails>{


	
	//correct code
	@Query(value = "SELECT * FROM patient_information " +
            "WHERE TO_CHAR(dates, 'YYYY-MM-DD HH24:MI:SS') = :dateString " , nativeQuery = true)
List<PatientDetails> findByExactTimestamp(@Param("dateString") String dateString);
	

	
  //for all information using date and doctor id
	@Query(value = "SELECT * FROM patient_information WHERE onlydate = :dateonly AND doctor = :doctorid", nativeQuery = true)
	List<PatientDetails> getPatientInfoBasedDateDoctor(@Param("dateonly") String dateonly, @Param("doctorid") String doctorid);

	
	@Query(value = "select * from patient_information where uhid=?1 ",nativeQuery = true)
	PatientDetails getByPatientId(String patientId);
	
//	@Query(value = "select * from patient_information where receptionist_id=?1AND dates=?2 order by upload_date desc",nativeQuery = true)
//	List<PatientDetails> getByReceptionId(String receptionistId,String dateValue);

	
	@Query(value = "SELECT * FROM patient_information WHERE receptionist_id = ?1 AND dates = ?2 ORDER BY upload_date DESC", nativeQuery = true)
	List<PatientDetails> getByReceptionId(String receptionistId, String dateValue);


	@Transactional
	@Modifying
	 @Query("DELETE FROM PatientDetails p WHERE p.uhid=:patientId")
	 int deleteByPatientId(String patientId);


	@Query(value = "select uhid from patient_information "
			+ "ORDER BY CAST(REGEXP_REPLACE(uhid, '[^0-9]', '', 'g') AS INTEGER) DESC LIMIT 1",nativeQuery = true)
	String getLastUhidNumber();

//
//	@Query(value ="select * from patient_information where email=?1 and dob=?2",nativeQuery = true)
//	PatientDetails getPatientDetails(String email, String username);
	@Query(value ="select * from patient_information where email=?1",nativeQuery = true)//order by uhid desc limit 1
	PatientDetails getPatientDetails(String email);



}