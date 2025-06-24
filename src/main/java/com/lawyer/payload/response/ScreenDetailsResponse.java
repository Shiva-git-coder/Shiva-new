package com.lawyer.payload.response;

import java.io.Serializable;
import java.util.Map;

import lombok.Data;

@Data
public class ScreenDetailsResponse implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	private Map<?, ?> data;
}
