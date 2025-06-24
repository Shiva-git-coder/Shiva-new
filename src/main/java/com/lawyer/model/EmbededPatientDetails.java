package com.lawyer.model;

import java.io.Serializable;

import org.springframework.lang.NonNull;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Id;
import lombok.Data;

//@Data
@Embeddable
public class EmbededPatientDetails implements Serializable {
    @NonNull
    @Id
	private String uhid;
    @NonNull
    @Id
	private String mobile;
    @NonNull
    @Id
	private String idNumber;
    @NonNull
    @Id
    private String patientName;

}
