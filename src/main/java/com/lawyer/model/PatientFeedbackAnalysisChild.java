package com.lawyer.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="patient_feedback_analysis_child")
public class PatientFeedbackAnalysisChild {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name="uni_id")
	private Long uniId;
	
	@Column(name="dates")
	private String dates;
	
	@Column(name="ivr_status")
	private String ivrStatus;
	
	@Column(name="feed_back")
	private String feedBack;
	
	@Column(name="upload_date")
	private String uploadDate;  
	
	
	
	 
	

}
