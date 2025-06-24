package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.PatientAppointments;

import jakarta.transaction.Transactional;

@Repository
public interface PatientAppointmentsRepo extends JpaRepository<PatientAppointments, Long>{

	// pending need to put current date
//	@Query(value="select distinct assigned_slot from patient_appointements where email=?1 and doctor_id=?2",nativeQuery = true)
//	List<String> getPatientUsedSlotsByCurrentDate(String patientEmail,String doctorId);
	
	@Query(value="select distinct assigned_slot from patient_appointements where doctor_id=:doctorId and date_of_appointment=:dateValue",nativeQuery = true)
	List<String> getPatientUsedSlotsByCurrentDate(String doctorId,String dateValue);

	@Transactional
	@Modifying
	@Query(value="update patient_appointements set status=?2 where uniq_key=?1",nativeQuery = true)
	int updateAppointmentStatus(long uniqKey, String status);
	
	@Transactional
	@Modifying
	@Query(value="update patient_appointements set uhid=?1 where email=?2 and date_of_appointment=?3",nativeQuery = true)
	int updateUHid(String uhid, String email,String appointmentDate);

	@Query(value="select exists (select * from patient_appointements where email=?1)",nativeQuery = true)
	boolean existedOrNot(String email);
	
	@Query(value="select * from patient_appointements where email=?1",nativeQuery = true)
	List<PatientAppointments> getPatinetAppointments(String patientMail);
	
	@Query(value = "select distinct assigned_slot from patient_appointements where date_of_appointment = ?1 and cancel_status = 'deactive'", nativeQuery = true)
	List<String> getDeactiveSlots(String dateValue);

	

}
