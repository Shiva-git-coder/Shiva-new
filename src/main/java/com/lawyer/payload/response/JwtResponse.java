package com.lawyer.payload.response;

import java.util.List;
import java.util.Objects;

public class JwtResponse {
	private String token;
	private Long id;
	private String username;
	private String email;
	private List<String> roles;
	private String department;
	private String doctorId;
	private String name;

	public JwtResponse(String token, Long id, String username, String email, List<String> roles, String department,
			String doctorId,String name) {
		super();
		this.token = token;
		this.id = id;
		this.username = username;
		this.email = email;
		this.roles = roles;
		this.department = department;
		this.doctorId = doctorId;
		this.name= name;

	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "JwtResponse [token=" + token + ", id=" + id + ", username=" + username + ", email=" + email + ", roles="
				+ roles + ", department=" + department + ", doctorId=" + doctorId + ", name=" + name + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(department, doctorId, email, id, name, roles, token, username);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		JwtResponse other = (JwtResponse) obj;
		return Objects.equals(department, other.department) && Objects.equals(doctorId, other.doctorId)
				&& Objects.equals(email, other.email) && Objects.equals(id, other.id)
				&& Objects.equals(name, other.name) && Objects.equals(roles, other.roles)
				&& Objects.equals(token, other.token) && Objects.equals(username, other.username);
	}

	

}
