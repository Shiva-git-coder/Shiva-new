package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.lawyer.model.DoctorGpt;

public interface DoctorGptRepository extends JpaRepository<DoctorGpt, String> {
	
	@Query(value = "SELECT * FROM doctor_gpt WHERE date_time::DATE = CAST(?1 AS DATE) ORDER BY date_time DESC", nativeQuery =  true) 
	List<DoctorGpt> dateWiseData(String dateVal); 

	
	@Query(value = "SELECT * FROM doctor_gpt WHERE date_time::DATE BETWEEN CAST(?1 AS DATE) - INTERVAL '7 days' AND CAST(?1 AS DATE) - INTERVAL '1 day' ORDER BY date_time DESC", nativeQuery = true)
	List<DoctorGpt> findLastSevenDaysData(String currentDate);


    
    @Query(value = "SELECT * FROM doctor_gpt WHERE tabs = :tabid ORDER BY date_time", nativeQuery = true)
    DoctorGpt findByTabsWiseinfo(@Param("tabid") String tabid);

}
