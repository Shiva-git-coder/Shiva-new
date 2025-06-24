package com.lawyer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="patient_medicine_status")
public class PatientEnquiry {
	
	@Id
	@GeneratedValue(strategy= GenerationType.SEQUENCE)
	private long uniqKey;
	
	@Column(name="patient_id")
	private String patientId;
	
	@Column(name="patient_name")
	private String patientName;
	
	@Column(name="contact_no")
	private String mobile;
	
	@Column(name="issue")
	private String issue;
	
	@Column(name="remainder_time")
	private String remainderTime;
	
	@Column(name="no_of_days")
	private String noOfDays;
	
	@Column(name="end_date")
	private String endDate;
	
	@Column(name="ivr_status")
	private String ivrStatus;
	
	@Column(name="upload_date")
	private String uploadDate;
	
	@Column(name="receptionist_id")
	private String receptionistId;

}
