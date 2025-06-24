package com.lawyer.model;
import java.io.Serializable;
import java.util.List;

public class EmployeeMaintanancePayload implements Serializable {

	private String id;
	private String role;
	private String username;
	private String email;
	private String department;
	private String phoneNo;
	private List<EmployeeDateAndTime> viewData;
	private String uploadedBy;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	public List<EmployeeDateAndTime> getViewData() {
		return viewData;
	}
	public void setViewData(List<EmployeeDateAndTime> viewData) {
		this.viewData = viewData;
	}
	public String getUploadedBy() {
		return uploadedBy;
	}
	public void setUploadedBy(String uploadedBy) {
		this.uploadedBy = uploadedBy;
	}
	

}
