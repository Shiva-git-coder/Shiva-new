package com.lawyer.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class SocialHistory  implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String alcholConsumption;
	private String livingSituation;
	private String sleep;
	private String stress;


}
