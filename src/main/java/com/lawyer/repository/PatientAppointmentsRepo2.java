package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.PatientAppointments;

import jakarta.transaction.Transactional;

@Repository
public interface PatientAppointmentsRepo2 extends JpaRepository<PatientAppointments, Long>{

	// pending need to put current date
	@Query(value="select distinct assigned_slot from patient_appointements where email=?1 and doctor_id=?2",nativeQuery = true)
	List<String> getPatientUsedSlotsByCurrentDate(String patientEmail,String doctorId);

	@Transactional
	@Modifying
	@Query(value="update patient_appointements set status=?2 where uniq_key=?1",nativeQuery = true)
	int updateAppointmentStatus(long uniqKey, String status);

	
	////
	@Query(value="select * from patient_appointements where email=?1",nativeQuery = true)
	List<PatientAppointments> getPatinetAppointments(String patientMail);
}
