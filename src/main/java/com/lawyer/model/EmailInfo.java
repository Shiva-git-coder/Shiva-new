package com.lawyer.model;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Objects;

public class EmailInfo implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String to;
	private String filePath;
	
	private String cc;
	
	private String subject;
	
	private String body;
	
	private String text;
	
	private String attachement_url;

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getCc() {
		return cc;
	}

	public void setCc(String cc) {
		this.cc = cc;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getAttachement_url() {
		return attachement_url;
	}

	public void setAttachement_url(String attachement_url) {
		this.attachement_url = attachement_url;
	}

	@Override
	public int hashCode() {
		return Objects.hash(attachement_url, body, cc, filePath, subject, text, to);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		EmailInfo other = (EmailInfo) obj;
		return Objects.equals(attachement_url, other.attachement_url) && Objects.equals(body, other.body)
				&& Objects.equals(cc, other.cc) && Objects.equals(filePath, other.filePath)
				&& Objects.equals(subject, other.subject) && Objects.equals(text, other.text)
				&& Objects.equals(to, other.to);
	}

	

	
	
	
	
}
