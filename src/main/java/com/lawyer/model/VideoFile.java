package com.lawyer.model;

import java.sql.Date;
import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "video_file")
@Data
public class VideoFile {
	/*
	 * modal class is store the path of the video file
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Integer id;

	@Column(name = "file_path")
	public String filePath;
	
	@Column(name = "patient_id")
	private String patienId ;
	
	@Column(name = "file_date")
	@CreationTimestamp
	private Timestamp date;

//     @CreationTimestamp
//     @ColumnDefault("CURRENT_TIMESTAMP")

}
