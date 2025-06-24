//package com.lawyer.service;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.lawyer.model.PatientFeedbackAnalysis;
//
//
//@Service
//public class AIService {
//
//	ObjectMapper mapper = new ObjectMapper();
//	private Logger logger = LoggerFactory.getLogger(PatientService.class);
//
//	public Object sendFeedbackToAI(PatientFeedbackAnalysis existing) {
//
//		try {
//			RestTemplate restTemplate = new RestTemplate();
//
//			String aiEndPoint = "http://0.0.0.0:8000/chat/";
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_JSON);
//
//			String jsonBody = mapper.writeValueAsString(existing);
//
//			logger.info("Feedback Json ~>" + jsonBody);
//
//			HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
//
//			ResponseEntity<Object> response = restTemplate.exchange(aiEndPoint, HttpMethod.POST, entity, Object.class);
//
//			logger.info("Response getting from AI ~>" + response.getBody());
//
//			if (response.getBody() != null)
//				return response.getBody();
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return null;
//
//	}
//
//}
