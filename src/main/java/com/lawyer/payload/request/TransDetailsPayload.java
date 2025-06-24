package com.lawyer.payload.request;

import java.io.Serializable;

import lombok.Data;

@Data
public class TransDetailsPayload  implements Serializable{
    /*it is  simple Payload.
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
		private Long studentId;
	    private double paidAmount;
	    private String transactionId;
	    private String transactionStatus;
	    private String paymentMethod;

}
