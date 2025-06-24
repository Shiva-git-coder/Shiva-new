package com.lawyer.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.DoctorGpt;
import com.lawyer.model.DoctorGptTabwiseFirstQuestionsAndAnswers;
import com.lawyer.service.DoctorGptService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/v1")

public class DoctorGptController {
	
   ObjectMapper mapper=new ObjectMapper();
   Logger logger=LoggerFactory.getLogger(DoctorGptController.class);

   @Autowired
   private DoctorGptService doctorGptService;
	
	@PostMapping("/savedoctorgptdata")
	public ResponseEntity<Object> saveStudentGptDetails(@RequestBody DoctorGpt doctorGpt)
	{
		Object response = null;
		try {
			logger.info("doctorGpt====>"+doctorGpt);
			response=doctorGptService.saveDoctorGptDetails(doctorGpt);
			logger.info("  response ====>"+mapper.writeValueAsString(response));
			if (response != null) {
				return ResponseEntity.status(HttpStatus.OK).body(response);
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File submission failed");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	/**
	 * 
	 * @param dateValue
	 * @return
	 */
	@GetMapping("/datewisefirstquestions")
	public ResponseEntity<Map<String,List<String>>> getfirstQuestionsCurrentDate(@RequestParam String dateValue){
		Map<String, List<String>> questionsData=null;
		try {
			
			questionsData=doctorGptService.getFirstQuestionTabWise(dateValue);
			return ResponseEntity.status(HttpStatus.OK).body(questionsData);
			
		}
		catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		
	}
	/**
	 * 
	 * @param dateValue
	 * @return
	 */
	@GetMapping("/getPrevioussevendaysfirstquestionstabwise")
	public ResponseEntity<DoctorGptTabwiseFirstQuestionsAndAnswers> getPreviousSevenDaysController(@RequestParam String dateValue){
		DoctorGptTabwiseFirstQuestionsAndAnswers previousSevenTabWiseQuestions=null;
		try {
			logger.info("call was triggered in controller");
			logger.info("dateValue=====>"+dateValue);
			previousSevenTabWiseQuestions=doctorGptService.getPreviousSevenDays(dateValue);
			return ResponseEntity.status(HttpStatus.OK).body(previousSevenTabWiseQuestions);

		}
		catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.OK).body(null);
		}
		
	}
	/**
	 * 
	 * @param tabid
	 * @return
	 */
	@GetMapping("/findbydatatabidwise")
	public ResponseEntity<DoctorGpt> findByTabData(@RequestParam String tabid){
		
		DoctorGpt doctorObject=null;
		try {
			logger.info("call was trigeered");
			logger.info("tabid is===>"+tabid);
			doctorObject=doctorGptService.getTabIdWiseData(tabid);
			logger.info("doctorObject===>"+doctorObject);
			return ResponseEntity.status(HttpStatus.OK).body(doctorObject);
			
			
		}
		catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.OK).body(null);

		}
		
		
	}
	
	@DeleteMapping("/deletetabiddata")
	public ResponseEntity<String> deleteTabWiseData(@RequestParam String tabId){
		String result;
		try {
			result=doctorGptService.deleteTabIdWise(tabId);
			return ResponseEntity.status(HttpStatus.OK).body(result);
			
		}
		catch (Exception e) {
			// TODO: handle exception
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
 
		}
		
		
	}

}
