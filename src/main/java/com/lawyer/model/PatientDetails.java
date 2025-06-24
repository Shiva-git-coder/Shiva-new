package com.lawyer.model;

import java.io.Serializable;

import java.sql.Timestamp;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;



//import javax.persistence.UniqueConstraint;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@IdClass(EmbededPatientDetails.class)
@Table(name = "patient_information")
public class PatientDetails implements Serializable {

	@Id
	private String uhid;
	@Id
	private String mobile;
	@Id
	private String idNumber;

	@Id
	private String patientName;
	
	@Column(name = "dates")
	private String datevalue;
	
	@Column(name = "department")
	private String department;
	
	@Column(name = "panel")
	private String panel;
	
	@Column(name="name_salute")
	private String namesalute;
	
	@Column(name = "gender")
	private String gender;
	
	@Column(name = "martial_status")
	private String martialStatus;
	
	@Column(name = "address")
	private String address;

	@Column(name = "blood_group")
	private String bloodGroup;
	
	@Column(name = "doctor_name")
	private String doctorName;
	
	@Column(name = "doctor_email")
	private String doctorEmail;
	
	@Column(name = "doctor_id")
	private String doctorId;
	
	@Column(name = "slot")
	private String slot;
	
	@Column(name = "opd_fee")
	private String opdFee;
	
	@Column(name = "relation_s_w_dof")
	private String relationsdwo;
	
	@Column(name = "s_w_dof_name")
	private String sWDofName;
	
	@Column(name = "select_relation")
	private String selectRelation;
	
	@Column(name = "dob")
	private String dob;
	
	@Column(name="age")
	private String age;
	
	@Column(name = "resident")
	private String resident;
	
	@Column(name = "state")
	private String state;
	
	@Column(name = "city")
	private String city;
	
	@Column(name = "email")
	private String email;
	
	@Column(name="id_proof_type")
	private String idProofType;
	
	@Column(name = "card_number")
	private String cardNo;
	
	@Column(name = "service")
	private String service;
	
	@Column(name = "rank")
	private String rank;
	
	@Column(name = "source")
	private String source;
	
	@Column(name = "discount")
	private String discount;
	
	@Column(name = "payment")
	private String payment;
	
	@Column(name = "remark")
	private String remark;
	
	@Column(name="select_referal")
	private String selectReferal;
	
	@Column(name="referal_mobile")
	private String referalMobileNo;

	@Column(name = "image")
	private String image;

	@Column(name="onlydate")
	private String onlydate;
	
	@Column(name="upload_date")
	private String uploadDate;
	
	@Column(name="receptionist_id")
	private String receptionistId;
	

}
