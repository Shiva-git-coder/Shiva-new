package com.lawyer.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.constants.Imageconversion;
import com.lawyer.model.ConversationEmdable;
import com.lawyer.model.ConversationSummery;
import com.lawyer.model.VideoFile;
import com.lawyer.payload.response.ResponseObject;
import com.lawyer.repository.ConversationRepository;
import com.lawyer.repository.VideoFileRepository;

@Service
public class VideoService {
	@Autowired
	private Imageconversion imgconvo;
	@Autowired
	private ConversationRepository vservicerepo;
	@Autowired
	private VideoFileRepository vfileRepo;
	
	private Logger logger = LoggerFactory.getLogger(VideoService.class);
	ObjectMapper mapper=new ObjectMapper();

	/**
	 * storing the file path in database a
	 * 
	 * @param file
	 * @param uPLOAD_DIR
	 * @param uhid 
	 * @return sucessful or error msg
	 */
	public String saveConversation(MultipartFile file, String uhid, String uploadDir) {
		try {
			Path originalFilePath = this.conversationFile(file, uploadDir);
			String path = file.getOriginalFilename();
			logger.info("the pathe is path ===>" + path);
			logger.info("the originalFilePath is path ===>" + originalFilePath);

			VideoFile videofile = new VideoFile();
			videofile.setFilePath(path);
			videofile.setPatienId(uhid);
			vfileRepo.save(videofile);
			return originalFilePath.toAbsolutePath().toString();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * this method stores file in the local directory
	 * 
	 * @param file
	 * @param uPLOAD_DIR
	 * @return
	 * @throws IOException
	 */

	private Path conversationFile(MultipartFile file, String uploadDir) throws IOException {
		try {
			String fileName = file.getOriginalFilename();
			logger.info("uploadDir==========>"+uploadDir);
			logger.info("file name is ==>"+fileName);
			// Save the file to a directory
			Path path = Paths.get(uploadDir + fileName);
			logger.info("Storing original file at: " + path.toString());
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
			return path;
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * it stores the conversation of doctor and patient
	 * 
	 * @param csummary
	 * @return
	 */
	public ResponseObject storingConvoInfo(ConversationSummery csummary) {
		ResponseObject response = new ResponseObject();
		try {
			if (csummary != null) {
				
				
				response.setStatus("true");
				response.setMessage("Saved successfully.");
				vservicerepo.save(csummary);
			} else {
				response.setStatus("false");
				response.setMessage("Failed to save.");
			}
		} catch (Exception e) {
			logger.error("error occured ~>", e);
			response.setStatus("false");
			response.setMessage("Failed to save.");
		}
		return response;
	}

	public List<ConversationSummery> gettingDetails(String uhid) {
		List<ConversationSummery> byPatientHistory = new ArrayList<>();
		try {
			logger.info("Getting uhid from front end ~>" + uhid);
			byPatientHistory = vservicerepo.findByPatientId(uhid);
			logger.info("Patient History ~>" + mapper.writeValueAsString(byPatientHistory));
			if (!byPatientHistory.isEmpty()) {
				List<ConversationSummery> sortedDesc = byPatientHistory.stream()
						.sorted(Comparator.comparing(ConversationSummery::getConversationDate).reversed())
						.collect(Collectors.toList());
				

				logger.info("sortedDesc Patient History ~>" + mapper.writeValueAsString(sortedDesc));

				if (!sortedDesc.isEmpty())
					return byPatientHistory;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public ConversationSummery fetching(String uhid, Timestamp time) {
		ConversationEmdable ce = new ConversationEmdable();
		ce.setPatientId(uhid);
		ce.setConversationDate(time);
		Optional<ConversationSummery> cs = vservicerepo.findById(ce);
		if (cs.isEmpty()) {
			return null;
		}
		return cs.get();

	}
	/**
	 * getting current date details
	 * @return
	 */
	public List<ConversationSummery>gettingCurrentDateDetails(){
		return vservicerepo.findByCurrentDate();
		
	}
}
