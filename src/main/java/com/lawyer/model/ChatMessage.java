package com.lawyer.model;

import lombok.Data;

@Data
public class ChatMessage {

	private DoctorGptUserQuestions user;
	private DoctorGptAssistantAnswers assistant;
	
	
}
