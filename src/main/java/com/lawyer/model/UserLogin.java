package com.lawyer.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLogin {
	
	@NotBlank
	private String userName;
	
	@NotBlank
	private String password;

}
