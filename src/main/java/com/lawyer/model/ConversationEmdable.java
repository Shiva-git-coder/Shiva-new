package com.lawyer.model;

import java.io.Serializable;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ConversationEmdable implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name = "patient_id")
	private String patientId;

	@Column(name = "conversation_date")
	private Timestamp conversationDate;

}
