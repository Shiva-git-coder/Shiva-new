package com.lawyer.payload.request;

import java.util.Objects;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {

	  @NotBlank
	  @Size(min = 3, max = 50)
	  private String username;

	  @NotBlank
	  @Size(max = 50)
	  @Email
	  private String email;

	  private Set<String> role;

	  @NotBlank
	  @Size(min = 6, max = 200)
	  private String password;
	  
	  private String department;
	  
	  private String mobile;
		
	  private String patientName;
	
	  private String dob;
	  
	
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
	
		public Set<String> getRole() {
			return role;
		}
	
		public void setRole(Set<String> role) {
			this.role = role;
		}
	
		public String getPassword() {
			return password;
		}
	
		public void setPassword(String password) {
			this.password = password;
		}
	
		public String getDepartment() {
			return department;
		}
	
		public void setDepartment(String department) {
			this.department = department;
		}
		
		public String getMobile() {
			return mobile;
		}

		public void setMobile(String mobile) {
			this.mobile = mobile;
		}

		public String getPatientName() {
			return patientName;
		}

		public void setPatientName(String patientName) {
			this.patientName = patientName;
		}

		public String getDob() {
			return dob;
		}

		public void setDob(String dob) {
			this.dob = dob;
		}

		@Override
		public int hashCode() {
			return Objects.hash(department, email, password, role, username);
		}
	
		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			SignupRequest other = (SignupRequest) obj;
			return Objects.equals(department, other.department) && Objects.equals(email, other.email)
					&& Objects.equals(password, other.password) && Objects.equals(role, other.role)
					&& Objects.equals(username, other.username);
		}
	
		@Override
		public String toString() {
			return "SignupRequest [username=" + username + ", email=" + email + ", role=" + role + ", password=" + password
					+ ", department=" + department + "]";
		}
	  

	
}
