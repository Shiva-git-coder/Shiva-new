package com.lawyer.utils;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawyer.model.GptInformation;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class JsonListConverterForDoctorGpt implements AttributeConverter<List<GptInformation>, String> {
	
	ObjectMapper mapper=new ObjectMapper();
	Logger logger=LoggerFactory.getLogger(JsonListConverterForDoctorGpt.class);
	
	@Override
	public String convertToDatabaseColumn(List<GptInformation> objList) {
		try {

			String json=mapper.writeValueAsString(objList);
			return json;
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			throw new RuntimeException("failed to convert List json",e);
		}
		
		
	}
	@Override
	public List<GptInformation> convertToEntityAttribute(String json){
		
		try {
			return mapper.readValue(json,
					mapper.getTypeFactory().constructCollectionType(List.class, GptInformation.class));
			
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("failed transform to attribute",e);
			// TODO: handle exception
		}
		
		
	}
	
	
}
