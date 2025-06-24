package com.lawyer.model;

import java.io.Serializable;
import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import com.lawyer.constants.JsonConvertor;


import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name="conversation_summery")
@IdClass(ConversationEmdable.class)
@Data
public class ConversationSummery implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	
	@Id
	@Column(name = "patient_id")
	private String patientId;

	//now it is not using if one patient contains diffrent receptionist we have to maintain receptionist also 
	@Column(name="receptionist_id")
	private String receptionistId;
	
   @Column(name="convo_details_json",columnDefinition = "TEXT")
   @Convert(converter = JsonConvertor.class)
   private ConvoDetails convodetails;
   
   @Id
   @Column(name="conversation_date")
   @CreationTimestamp
   private Timestamp conversationDate;
}
