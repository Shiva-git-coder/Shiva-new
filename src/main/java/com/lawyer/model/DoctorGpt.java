package com.lawyer.model;

import java.io.Serializable;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.lawyer.utils.JsonListConverterForDoctorGpt;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="doctor_gpt")
@Data
public class DoctorGpt implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "tabs")
	private String tabs;
	@Column(name = "doctor_id")
	private String doctorId;
	@Column(name = "date_time")
	@CreationTimestamp
	private String dateTime;
	@Column(name = "gpt_information_json", columnDefinition = "TEXT")
	@Convert(converter = JsonListConverterForDoctorGpt.class)
	private List<GptInformation> gptInfo;

}
