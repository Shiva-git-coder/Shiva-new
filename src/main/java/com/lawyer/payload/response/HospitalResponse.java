package com.lawyer.payload.response;

import java.io.Serializable;
import java.util.Map;

public class HospitalResponse implements Serializable {
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Object hospitalresponse;
	private Map<String,String> imageurl;
	
	
	


	public HospitalResponse(Object hospitalresponse, Map<String, String> imageurl) {
		super();
		this.hospitalresponse = hospitalresponse;
		this.imageurl = imageurl;
	}


	public Object getHospitalresponse() {
		return hospitalresponse;
	}


	public void setHospitalresponse(Object hospitalresponse) {
		this.hospitalresponse = hospitalresponse;
	}


	public Map<String, String> getImageurl() {
		return imageurl;
	}


	public void setImageurl(Map<String, String> imageurl) {
		this.imageurl = imageurl;
	}


	public static long getSerialversionuid() {
		return serialVersionUID;
	}



}
