package com.lawyer.payload.request;

import com.lawyer.model.ConvoDetails;

public class MyReportPayload {
	
	private String reportDate;
	
	private String issue;
	
	private String doctorName;
	
	private String doctorId;
	
	private String reportName;
	
	private ConvoDetails conversationHistory;

	public String getReportDate() {
		return reportDate;
	}

	public void setReportDate(String reportDate) {
		this.reportDate = reportDate;
	}

	public String getIssue() {
		return issue;
	}

	public void setIssue(String issue) {
		this.issue = issue;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}

	public String getReportName() {
		return reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public ConvoDetails getConversationHistory() {
		return conversationHistory;
	}

	public void setConversationHistory(ConvoDetails conversationHistory) {
		this.conversationHistory = conversationHistory;
	}



}
