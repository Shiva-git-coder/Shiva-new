package com.lawyer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.PatientEnquiry;

@Repository
public interface PatientEnquiryRepo extends JpaRepository<PatientEnquiry, Long> {

	@Query(value="select * from patient_medicine_status where patient_id=?1",nativeQuery = true)
	Optional<PatientEnquiry> getPatientById(String patientId);

	@Query(value = "select exists( select * from patient_medicine_status where patient_id=?1) ",nativeQuery = true)
	boolean existingPatientOrNot(String patientId);
	
	@Query(value = "select * from patient_medicine_status where receptionist_id=?1",nativeQuery = true)
	List<PatientEnquiry> getByReceptionistId(String receptionistId);
	

}
