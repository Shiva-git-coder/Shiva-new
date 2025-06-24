package com.lawyer.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.ConversationSummery;
import com.lawyer.service.VideoService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
//@Slf4j
public class ConvoVideoController {

	@Value("${upload}")
	private String uploadFilePath;
	@Autowired
	private VideoService videoservice;
		
	private Logger logger = LoggerFactory.getLogger(ConvoVideoController.class);
	ObjectMapper mapper=new ObjectMapper();

	
	/**
	 * Saving audio File
	 * @param file
	 */
	@PostMapping(value = "/convoFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> videoConverstion(@RequestPart(name = "file",required = true) MultipartFile file,
			@RequestParam String uhid) {
		String msg = "";
		try {
			logger.info("UHID from the front end ~>" + uhid);
			if (uhid.isEmpty())
				return ResponseEntity.badRequest().build();

			msg = videoservice.saveConversation(file, uhid, uploadFilePath);
			return ResponseEntity.ok().body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(null);

		}
	}

	/**
	 * Saving converation summary
	 */
	@PostMapping(value = "/storeinfo")
	public ResponseEntity<Object> storingConvoInfo(@RequestBody ConversationSummery csummary) {
		Object msg = "";
		try {
			logger.info("From front end ~>" + mapper.writeValueAsString(csummary));
			msg = videoservice.storingConvoInfo(csummary);
			return ResponseEntity.ok().body(msg);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(null);
		}
	}

	/**
	 * 
	 */
	@GetMapping("/conversation/doctor/patient/alldetails")
	public ResponseEntity<List<ConversationSummery>> fetchingDetails(@RequestParam String uhid) {
		List<ConversationSummery> patientHistory = new ArrayList<>();
		try {
			if (uhid != null)
				patientHistory = videoservice.gettingDetails(uhid);
			return ResponseEntity.status(HttpStatus.OK).body(patientHistory);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	} 
	/**
	 * 
	 * @param uhid
	 * @param date
	 * @return
	 */
	@GetMapping("/fetchinSinglePatient")
	public ResponseEntity<ConversationSummery> fetchingSingleConvo(@RequestParam String uhid,Timestamp date){
		ConversationSummery cs=videoservice.fetching(uhid,date);
		return ResponseEntity.status(HttpStatus.OK).body(cs);
	}

	/**
	 * getting current date conversation details
	 * @return
	 */
	@GetMapping("/currentdate/markascompleted/details")
	public ResponseEntity<List<ConversationSummery>> gettingCurrentDateAllPatientDetils(){
		List<ConversationSummery> result=videoservice.gettingCurrentDateDetails();
		return ResponseEntity .status(HttpStatus.OK).body(result);
		
		
	}
}
