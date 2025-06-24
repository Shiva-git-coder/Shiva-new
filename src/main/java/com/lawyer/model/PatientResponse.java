package com.lawyer.model;

import java.io.Serializable;
import java.sql.Timestamp;

import org.hibernate.annotations.CurrentTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctor_patient_maping")
public class PatientResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "id")
	private Long id;

	@Column(name = "patient_id")
	private String patientId;
	
	@Column(name = "patient_email")
	private String patientEmail;
	
	@Column(name = "doctor_id")
	private String doctorId;
	
	@Column(name = "assigned_date")
	private String date;

	@Column(name = "mark_as_completed_status")
	private String status;
	
	@Column(name = "current_upload_date")
	private String currentDate;
	
	@Column(name="receptionist_email")
	private String assignedBy;
	
	@Column(name="receptionist_id")
	private String receptionistId;

}
