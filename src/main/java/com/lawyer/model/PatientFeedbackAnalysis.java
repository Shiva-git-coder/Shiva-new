package com.lawyer.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "patient_feedback_analysis")
@Data
@EqualsAndHashCode
public class PatientFeedbackAnalysis implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long uniqKey;

	@Column(name = "patient_id")
	private String patientId;

	@Column(name = "patient_name")
	private String patientName;

	@Column(name = "contact_no")
	private String mobile;

	@Column(name = "issue")
	private String issue;

//	@Column(name="feedback")
//	private String feedback;

	@Column(name = "remainder_time")
	private String remainderTime;

	@Column(name = "no_of_days")
	private String noOfDays;

	@Column(name = "end_date")
	private String endDate;

	@Column(name = "upload_date")
	private String uploadDate;

	@Column(name = "receptionist_id")
	private String receptionistId;

	@Column(name = "coversation_time")
	private String conversationTime;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "date_id")
	private List<PatientFeedbackAnalysisChild> patientFeedbackAnalysisChild;

}
