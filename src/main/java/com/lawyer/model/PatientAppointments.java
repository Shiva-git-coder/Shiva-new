package com.lawyer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="patient_appointements")
public class PatientAppointments {

	@Id
	@Column(name = "uniq_key")
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long uniqKey;

	@Column(name = "uhid")
	private String UHId;

	@Column(name = "patient_name")
	private String patientName;

	@Column(name = "email")
	private String email;

	@Column(name = "phone_number")
	private String phoneNo;
	
	@Column(name = "doctor_Id")
	private String doctorId;
	
	@Column(name = "doctor_name")
	private String doctorName;
	
	@Column(name = "doctor_dept")
	private String doctorDept;

	@Column(name = "date_of_appointment")
	private String dateOfAppointment;
	
	@Column(name = "assigned_slot")
	private String assignedSlot;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "upload_date_time")
	private String uploadDateTime;
	
	@Column(name="status")
	private String appointmentStatus;
	
	@Column(name="cancel_status")
	private String cancelStatus="Active";

	public long getUniqKey() {
		return uniqKey;
	}

	public void setUniqKey(long uniqKey) {
		this.uniqKey = uniqKey;
	}

	public String getUHId() {
		return UHId;
	}

	public void setUHId(String uHId) {
		UHId = uHId;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getDoctorDept() {
		return doctorDept;
	}

	public void setDoctorDept(String doctorDept) {
		this.doctorDept = doctorDept;
	}

	public String getDateOfAppointment() {
		return dateOfAppointment;
	}

	public void setDateOfAppointment(String dateOfAppointment) {
		this.dateOfAppointment = dateOfAppointment;
	}

	public String getAssignedSlot() {
		return assignedSlot;
	}

	public void setAssignedSlot(String assignedSlot) {
		this.assignedSlot = assignedSlot;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getUploadDateTime() {
		return uploadDateTime;
	}

	public void setUploadDateTime(String uploadDateTime) {
		this.uploadDateTime = uploadDateTime;
	}

	public String getAppointmentStatus() {
		return appointmentStatus;
	}

	public void setAppointmentStatus(String appointmentStatus) {
		this.appointmentStatus = appointmentStatus;
	}

	public String getCancelStatus() {
		return cancelStatus;
	}

	public void setCancelStatus(String cancelStatus) {
		this.cancelStatus = cancelStatus;
	}

	@Override
	public String toString() {
		return "PatientAppointments [uniqKey=" + uniqKey + ", UHId=" + UHId + ", patientName=" + patientName
				+ ", email=" + email + ", phoneNo=" + phoneNo + ", doctorId=" + doctorId + ", doctorName=" + doctorName
				+ ", doctorDept=" + doctorDept + ", dateOfAppointment=" + dateOfAppointment + ", assignedSlot="
				+ assignedSlot + ", remarks=" + remarks + ", uploadDateTime=" + uploadDateTime + ", appointmentStatus="
				+ appointmentStatus + ", cancelStatus=" + cancelStatus + "]";
	}

	

}
