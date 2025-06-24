package com.lawyer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lawyer.model.VideoFile;

public interface VideoFileRepository extends JpaRepository<VideoFile, Integer> {

}
