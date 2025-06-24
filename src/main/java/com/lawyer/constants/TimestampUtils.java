package com.lawyer.constants;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimestampUtils {
	 // Method to get only the date part as a String
    public static String getDateFromTimestamp(Timestamp timestamp) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime localDateTime = timestamp.toLocalDateTime();
        return localDateTime.format(dateFormatter); // e.g., "2024-10-28"
    }

    // Method to get only the time part as a String
    public static String getTimeFromTimestamp(Timestamp timestamp) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalDateTime localDateTime = timestamp.toLocalDateTime();
        return localDateTime.format(timeFormatter); // e.g., "11:11:44"
    }

}
