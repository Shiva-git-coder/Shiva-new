package com.lawyer.constants;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ObjectMapperInstance {

	private static volatile ObjectMapper singletonObj = null;

	public static ObjectMapper instance() {
		if (singletonObj == null) {
			
				if (singletonObj == null)
					singletonObj = new ObjectMapper();
			
		}
		return singletonObj;
	}  

}
 