package com.lawyer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "patient_basic")
@Data
public class PatientBasic {

	/**
	 * 
	 */
	@Id
	@Column(name = "patient_id")
	private String patientId;

	@Column(name = "systolic_bp")
	private int systolicBP;

	@Column(name = "diastolic_bp")
	private int diastolicBP;

	@Column(name = "weight")
	private float weight;

	@Column(name = "height")
	private float height;

	@Column(name = "temperature")
	private float temperature;

	@Column(name = "heart_rate")
	private int heartRate;

	@Column(name = "respiratory_rate")
	private int respiratoryRate;

	@Column(name = "blood_sugar_f")
	private float bloodSugarF;

	@Column(name = "blood_sugar_r")
	private float bloodSugarR;

	@Column(name = "avpu")
	private String avpu;

	@Column(name = "trauma")
	private String trauma;

	@Column(name = "bmi")
	private float bmi;

	@Column(name = "urine_output")
	private float urineOutput;

	@Column(name = "spo2")
	private int spo2;

	@Column(name = "oxygen_supplementation")
	private String oxygenSupplementation;

	@Column(name = "mobility")
	private String mobility;

	@Column(name = "comments")
	private String comments;
}
