package com.lawyer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.PatientEnquiry;
import com.lawyer.model.PatientFeedbackAnalysis;

@Repository
public interface PatientFeedbackAnalysisRepo extends JpaRepository<PatientFeedbackAnalysis, Long> {
	
	@Query(value="select * from patient_feedback_analysis where patient_id=?1",nativeQuery = true)
	Optional<PatientFeedbackAnalysis> getPatientById(String patientId);

	@Query(value = "select exists( select * from patient_feedback_analysis where coversation_time=?1) ",nativeQuery = true)
	boolean existingTimeOrNot(String conversationTime);
	
	@Query(value = "select * from patient_feedback_analysis where receptionist_id=?1",nativeQuery = true)
	List<PatientFeedbackAnalysis> getByReceptionistId(String receptionistId);

}
