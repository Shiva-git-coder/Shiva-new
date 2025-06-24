package com.lawyer.payload.request;

import org.springframework.stereotype.Component;

@Component
public class JwtResponseDTO {

	private String accessToken;
	private String token;

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	
}
