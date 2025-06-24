package com.lawyer.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.NotBlank;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "hospital_roles")
@Data
public class HospitalRolesModel implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "hospital_role_id")
	@SequenceGenerator(name = "hospital_role_sequence", sequenceName = "hospital_role_sequence", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hospital_role_sequence")
	private long hospitalRoleId;

	@Column(name = "hospital_role_name")
	@NotBlank
	private String hospitalRoleName;

	
	 

}
