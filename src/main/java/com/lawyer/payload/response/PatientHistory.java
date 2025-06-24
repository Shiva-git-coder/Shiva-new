package com.lawyer.payload.response;

import lombok.Data;


@Data
public class PatientHistory {
	
	private String uhid;
	private String patientName;
	private String dob;
	private boolean history;
	private String assignDate;
	
	//newly adding
	private String recptionistIdNumber;
	

}
