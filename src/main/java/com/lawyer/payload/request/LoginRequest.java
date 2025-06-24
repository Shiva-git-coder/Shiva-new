package com.lawyer.payload.request;

import java.util.Objects;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

	@NotBlank
	private String username;

	@NotBlank
	private String password;
	
//	@NotBlank
	private String ipAddress;
	
//	@NotBlank
	private String macAddress;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getMacAddress() {
		return macAddress;
	}

	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}

	@Override
	public int hashCode() {
		return Objects.hash(ipAddress, macAddress, password, username);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LoginRequest other = (LoginRequest) obj;
		return Objects.equals(ipAddress, other.ipAddress) && Objects.equals(macAddress, other.macAddress)
				&& Objects.equals(password, other.password) && Objects.equals(username, other.username);
	}

	
}
