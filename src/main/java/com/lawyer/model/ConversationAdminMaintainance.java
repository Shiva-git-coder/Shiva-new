package com.lawyer.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name="admin_mainatainance_conversation") 
@Data
@EqualsAndHashCode
public class ConversationAdminMaintainance implements Serializable {
/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name="uniq_key")
	private Long adminId;
	
	@Column(name="role")
	private String role;
	
	@Column(name="id")
	private String id;
	
	@Column(name="phone_number")
	private String phoneNo;
	
	@Column(name="user_name")
	private String username;
	
	@Column(name="email")
	private String email;
	
	@Column(name="department")
	private String department;
	
	@Column(name="available_slots")
	private String availableSlots;
	
	@Column(name="date")
	private String date;
	
	@Column(name="upload_date_time")
	private String uploadDateTime;
	
	@Column(name="uplaoded_by")
	private String uploadedBy;

}
