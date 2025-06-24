package com.lawyer.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.ChatMessage;
import com.lawyer.model.DoctorGpt;
import com.lawyer.model.DoctorGptTabwiseFirstQuestionsAndAnswers;
import com.lawyer.model.GptInformation;
import com.lawyer.payload.response.ResponseObject;
import com.lawyer.repository.DoctorGptRepository;

@Service
public class DoctorGptService {

	ObjectMapper mapper = new ObjectMapper();
	Logger logger = LoggerFactory.getLogger(DoctorGptService.class);

	@Autowired
	private DoctorGptRepository doctorGptRepository;

	public Object saveDoctorGptDetails(DoctorGpt doctorGpt) {
		
		logger.info("call was triggered in service");
		ResponseObject responseObject = new ResponseObject();
		DoctorGpt savedObj = null;
		try {
			logger.info("doctortGpt====>" + mapper.writeValueAsString(doctorGpt));
			if (doctorGpt != null) {
				savedObj = doctorGptRepository.save(doctorGpt);
				logger.info("savedObj====>" + mapper.writeValueAsString(savedObj));
				if (savedObj != null) {
					responseObject.setStatus("true");
					responseObject.setMessage("data saved successfully");
				} else {
					responseObject.setStatus("false");
					responseObject.setMessage("Failed to save data");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			responseObject.setStatus("false");
			responseObject.setMessage("Failed to save data");
		}
		return responseObject;
	}

	public Map<String,List<String>> getFirstQuestionTabWise(String dateValue) {

		List<DoctorGpt> savedObjects = null;
		List<String> tabId=null;
		

		try {
			
			
			savedObjects = doctorGptRepository.dateWiseData(dateValue);
			//for that day tab ids
			tabId=savedObjects.stream().map(Ids->Ids.getTabs()).collect(Collectors.toList());
			
			logger.info("tabIds====>"+tabId);
			
			//for in that tab first question
			List<String> firstQuestions = savedObjects.stream().map(tab -> {
				List<GptInformation> gptList = tab.getGptInfo();
				if (gptList != null && !gptList.isEmpty()) {
					List<ChatMessage> chatMsgObject = gptList.get(0).getChat_messages();
					if (chatMsgObject != null && !chatMsgObject.isEmpty()) {
						return chatMsgObject.get(0).getUser().getUserQuestion();
					}

				}
				return null;
			}).filter(question -> question != null).collect(Collectors.toList());
			


			Map<String,List<String>> result=new HashMap<>();
			result.put("tabId", tabId);
		    result.put("firstQuestions",firstQuestions);
		    

			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}

	}

	
	
	
	
	public DoctorGptTabwiseFirstQuestionsAndAnswers getPreviousSevenDays(String dateValue) {
	    logger.info("dateValue=====>" + dateValue);
	    List<String> firstQuestions = new ArrayList<>();
	    List<String> tabId = new ArrayList<>();

	    try {
	        List<DoctorGpt> doctorChatObjects = doctorGptRepository.findLastSevenDaysData(dateValue);

	        if (doctorChatObjects != null && !doctorChatObjects.isEmpty()) {
	            tabId = doctorChatObjects.stream()
	                    .map(DoctorGpt::getTabs)
	                    .filter(tabid->tabid!=null)
	                    .collect(Collectors.toList());
	            logger.info("tabId===>" + tabId);

	            firstQuestions = doctorChatObjects.stream()
	                    .map(studentChatRebot -> {
	                        List<GptInformation> gptInfoList = studentChatRebot.getGptInfo();
	                        if (gptInfoList != null && !gptInfoList.isEmpty()) {
	                        	GptInformation firstGptInfo =gptInfoList.get(0) ;
	                            List<ChatMessage> chatMessages = firstGptInfo.getChat_messages();
	                            if (chatMessages != null && !chatMessages.isEmpty()) {
	                                ChatMessage firstChatMessage = chatMessages.get(0);
	                                if (firstChatMessage.getUser() != null) {
	                                    return firstChatMessage.getUser().getUserQuestion();
	                                }
	                            }
	                        }
	                        return null;
	                    })
	                    .filter(question -> question != null)
	                    .collect(Collectors.toList());
	        }

	    } catch (Exception e) {
	        logger.error("Error occurred: ", e);
	    }

	    logger.info("firstQuestions=======>" + firstQuestions);
	    return new DoctorGptTabwiseFirstQuestionsAndAnswers(tabId, firstQuestions);
	}	
	/**
	 * 
	 * @param tabId
	 * @return
	 */
	public DoctorGpt getTabIdWiseData(String tabId) {
		
		DoctorGpt studentChatRebot=null;
		try {
			studentChatRebot=doctorGptRepository.findByTabsWiseinfo(tabId);
			return studentChatRebot;
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}
		
		
		
	}
	public String deleteTabIdWise(String tabId) {
	
		logger.info("tabId is ===>"+tabId);
		Optional<DoctorGpt> tabIdObject=null;
		String result;
		try {
			  tabIdObject=doctorGptRepository.findById(tabId);
			  if(tabIdObject.isPresent()) {
				  doctorGptRepository.deleteById(tabId);
				  result="tabId "+tabId+"was deleted";
			  }
			  else {
			  result= "tabId "+tabId+"was deleted";
			  }
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}
		return result;
  
		
	}
}
