package com.lawyer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="departments")
public class DepartmentsForAIScribe {
	
	@Id
	@Column(name="dept_id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long deptId;
	
	@Column(name="department_name")
	private String deptName;
	
	@Column(name="department_short")
	private String deptShortName;
	
	@Column(name="upload_date_time")
	private String uploadDateTime;

	public long getDeptId() {
		return deptId;
	}

	public void setDeptId(long deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getDeptShortName() {
		return deptShortName;
	}

	public void setDeptShortName(String deptShortName) {
		this.deptShortName = deptShortName;
	}

	public String getUploadDateTime() {
		return uploadDateTime;
	}

	public void setUploadDateTime(String uploadDateTime) {
		this.uploadDateTime = uploadDateTime;
	}

	@Override
	public String toString() {
		return "DepartmentsForAiScribe [deptId=" + deptId + ", deptName=" + deptName + ", deptShortName="
				+ deptShortName + ", uploadDateTime=" + uploadDateTime + "]";
	}
	
	
	
		

}
