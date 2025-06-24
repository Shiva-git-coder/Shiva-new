package com.lawyer.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;


@Data
public class ConvoDetails implements Serializable {
	
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	private String case_identification_information;
	private String conversation_overview;
	private String clients_objectives;
	private String facts_of_the_case;
	private String legal_issues_identified;
	private String relevant_legal_precedents_or_laws;
	private String evidence_mentioned;
	private String legal_advice_given;
	private String next_steps_action_plan;
	private String clients_questions_or_concerns;
	private String financial_considerations;
	private String risks_and_challenges;
	private String follow_up_actions;
	private String final_notes_and_observations;
	
	
//	private String summary;
//	private String currentMedication;
//	private String medicalHistory;
//	private String surgicalHistory;
//	private String history_of_present_illness;
//    private String hospitalisationHistory;
//    private String familyHistory;
//    private List<SocialHistory> socialHistory;
//    private String vitals;
//    private String Examination;
//    private String treatmentPlan;
//    private String nextAppointment;
//    private String assessments;
//    private List<String> Allergies; 
//    private String conversation;

}
