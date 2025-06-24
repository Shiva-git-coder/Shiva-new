package com.lawyer.payload.request;

import org.springframework.stereotype.Component;

@Component
public class RefreshTokenRequestDTO {

	private String token;
	private String username;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
