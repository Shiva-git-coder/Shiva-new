package com.lawyer.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.context.SecurityContextHolder;

import com.lawyer.security.services.UserDetailsImpl;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "username"),
		@UniqueConstraint(columnNames = "email") })
public class User {

	
	
	public User(@NotBlank @Size(max = 50) String username, @NotBlank @Size(max = 50) @Email String email,
			@NotBlank @Size(max = 120) String password, String department, String usersStatus, String patientName,
			String dob, String mobile) {
		super();
		this.username = username;
		this.email = email;
		this.password = password;
		this.department = department;
		this.usersStatus = usersStatus;
		this.patientName=patientName;
		this.dob=dob;
		this.mobile=mobile;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 50)
	private String username;

	@NotBlank
	@Size(max = 50)
	@Email
	private String email;

//	@NotBlank
//	@Size(max = 120)
	private String password;
	
	@Column(name="mobile")
	private String mobile;
	
	@Column(name="patient_name")
	private String patientName;
	
	@Column(name="date_of_birth")
	private String dob;
	
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	
	@Column(name = "departmentname")
	private String department;

	@Column(name = "users_status")
	private String usersStatus;
	
	   public User() {}

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getUsersStatus() {
		return usersStatus;
	}

	public void setUsersStatus(String usersStatus) {
		this.usersStatus = usersStatus;
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
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", email=" + email + ", password=" + password + ", mobile="
				+ mobile + ", patientName=" + patientName + ", dob=" + dob + ", roles=" + roles + ", department="
				+ department + ", usersStatus=" + usersStatus + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(department, dob, email, id, mobile, password, patientName, roles, username, usersStatus);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		return Objects.equals(department, other.department) && Objects.equals(dob, other.dob)
				&& Objects.equals(email, other.email) && Objects.equals(id, other.id)
				&& Objects.equals(mobile, other.mobile) && Objects.equals(password, other.password)
				&& Objects.equals(patientName, other.patientName) && Objects.equals(roles, other.roles)
				&& Objects.equals(username, other.username) && Objects.equals(usersStatus, other.usersStatus);
	}

	
	
	
	
}
