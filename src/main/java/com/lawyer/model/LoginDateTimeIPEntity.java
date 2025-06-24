package com.lawyer.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

//import org.hibernate.envers.Audited;
import org.springframework.security.core.context.SecurityContextHolder;

import com.lawyer.security.services.UserDetailsImpl;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//@Audited
@Entity
@Table(name = "login_details_history")
public class LoginDateTimeIPEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "unique_key")
	private long uniqueKey;

	@Column(name = "date")
	private String date;

	@Column(name = "time")
	private String time;

	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "current_user_name")
	private String currentUserName;
	@Column(name = "current_user_email")
	private String currentUserEmail;
	@Column(name = "current_upload_datetime")
	private String currentUploadDateTime;

	public LoginDateTimeIPEntity() {
		super();
		if (SecurityContextHolder.getContext().getAuthentication() != null
				&& SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetailsImpl) {
			UserDetailsImpl detailsImpl = SecurityContextHolder.getContext().getAuthentication() != null
					? (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()
					: null;
			this.currentUserEmail = detailsImpl != null ? detailsImpl.getEmail() : null;
			this.currentUserName = detailsImpl != null ? detailsImpl.getUsername() : null;
			this.currentUploadDateTime = new Date().toString();
		}
	}

	public long getUniqueKey() {
		return uniqueKey;
	}

	public void setUniqueKey(long uniqueKey) {
		this.uniqueKey = uniqueKey;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCurrentUserName() {
		return currentUserName;
	}

	public void setCurrentUserName(String currentUserName) {
		this.currentUserName = currentUserName;
	}

	public String getCurrentUserEmail() {
		return currentUserEmail;
	}

	public void setCurrentUserEmail(String currentUserEmail) {
		this.currentUserEmail = currentUserEmail;
	}

	public String getCurrentUploadDateTime() {
		return currentUploadDateTime;
	}

	public void setCurrentUploadDateTime(String currentUploadDateTime) {
		this.currentUploadDateTime = currentUploadDateTime;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public int hashCode() {
		return Objects.hash(currentUploadDateTime, currentUserEmail, currentUserName, date, ipAddress, time, uniqueKey,
				userName);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LoginDateTimeIPEntity other = (LoginDateTimeIPEntity) obj;
		return Objects.equals(currentUploadDateTime, other.currentUploadDateTime)
				&& Objects.equals(currentUserEmail, other.currentUserEmail)
				&& Objects.equals(currentUserName, other.currentUserName) && Objects.equals(date, other.date)
				&& Objects.equals(ipAddress, other.ipAddress) && Objects.equals(time, other.time)
				&& uniqueKey == other.uniqueKey && Objects.equals(userName, other.userName);
	}

	@Override
	public String toString() {
		return "LoginDateTimeIPEntity [uniqueKey=" + uniqueKey + ", date=" + date + ", time=" + time + ", ipAddress="
				+ ipAddress + ", userName=" + userName + ", currentUserName=" + currentUserName + ", currentUserEmail="
				+ currentUserEmail + ", currentUploadDateTime=" + currentUploadDateTime + "]";
	}

}
