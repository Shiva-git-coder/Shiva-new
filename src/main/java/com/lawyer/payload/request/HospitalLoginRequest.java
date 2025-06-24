package com.lawyer.payload.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HospitalLoginRequest {
	
	@NotBlank
	private String code;
	
	@NotBlank
	private String password;
	

}
