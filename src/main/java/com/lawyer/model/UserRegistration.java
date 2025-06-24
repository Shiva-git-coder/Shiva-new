package com.lawyer.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "user_registeration", uniqueConstraints = { @UniqueConstraint(columnNames = "user_name"),
		@UniqueConstraint(columnNames = "email"),@UniqueConstraint(columnNames="user_login_id") })
@Data
public class UserRegistration implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_details_sequence")
	@SequenceGenerator(name = "user_details_sequence", sequenceName = "user_details_sequence", allocationSize = 1)
	@Column(name = "user_details_id")
	private long userDetailsId;

	@NotBlank
	@Size(min = 5, max = 50, message = "The UserName ID must contain more than 5 characters and less than 50 characters.")
	@Column(name = "user_name")
	private String userName;

	@NotBlank
	@Size(min = 5, max = 50, message = "The Email ID must contain more than 5 characters and less than 50 characters or the mail Id is not valid")
	@Email
	@Column(name = "email")
	private String email;
	
    @NotBlank
    @Column(name="user_login_id")

	private String userLoginId;
    
	@NotBlank
	@Size(min = 5, max = 50, message = "The Password must contain more than 5 characters and less than 50 characters.")
	@Column(name = "password")
	private String password;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_and_role_mapping", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<HospitalRolesModel> userAndRole = new HashSet<>();

	
}
