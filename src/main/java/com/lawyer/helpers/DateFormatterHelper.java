package com.lawyer.helpers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateFormatterHelper {
	
	
public static String convertDate(String date) {
		
        DateTimeFormatter[] dateFormatters = new DateTimeFormatter[] {
        		
        		DateTimeFormatter.ofPattern("d/M/yyyy"),
        		DateTimeFormatter.ofPattern("M/d/yy"),
        		DateTimeFormatter.ofPattern("MM/d/yyyy"),
        		DateTimeFormatter.ofPattern("dd/MM/yyyy"),     // 17/12/2024
        	    DateTimeFormatter.ofPattern("yyyy/MM/dd"),     // 2024/12/17
        	    DateTimeFormatter.ofPattern("dd-MM-yyyy"),     // 17-12-2024
        	    DateTimeFormatter.ofPattern("yyyy-MM-dd"),     // 2024-12-17
        	    DateTimeFormatter.ofPattern("MM/dd/yyyy"),     // 12/17/2024
        	    DateTimeFormatter.ofPattern("MM-dd-yyyy"),     // 12-17-2024
        	    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"), // 2024-12-17 14:30 (Date + Time)
        	    DateTimeFormatter.ofPattern("dd/MM/yy"),        // 17/12/24
        	    DateTimeFormatter.ofPattern("yy/MM/dd"),        // 24/12/17
        	    DateTimeFormatter.ofPattern("MM/dd/yy"),        // 12/17/24
        	    DateTimeFormatter.ofPattern("MM-yy-dd"),        // 12-24-17
        	    DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"), // 2024/12/17 14:30 (Date + Time)
        	    DateTimeFormatter.ofPattern("d/M/yyyy"),        // 7/12/2024 (single digit for day/month)
        	    DateTimeFormatter.ofPattern("d-M-yyyy"),        // 7-12-2024
        	    DateTimeFormatter.ofPattern("yyyy-M-d"),        // 2024-12-7
        	    DateTimeFormatter.ofPattern("yyyy/M/d"),
        };
        DateTimeFormatter desiredFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//        DateTimeFormatter desiredFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate parsedDate = null;
        for (DateTimeFormatter formatter : dateFormatters) {
			try {
				parsedDate = LocalDate.parse(date, formatter);
				break;
			} catch (DateTimeParseException e) {
            }
        }
        if (parsedDate == null) {
            return "Invalid date format";
        }
        return parsedDate.format(desiredFormatter);
    }

}
