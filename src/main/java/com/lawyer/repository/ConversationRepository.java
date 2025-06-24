package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.lawyer.model.ConversationEmdable;
import com.lawyer.model.ConversationSummery;


public interface ConversationRepository extends PagingAndSortingRepository<ConversationSummery, ConversationEmdable> ,
 JpaRepository<ConversationSummery, ConversationEmdable>
{
	
	 List<ConversationSummery> findByPatientId(String uhid);
	 
	 @Query(value="SELECT * FROM conversation_summery c where(c.conversation_date)::date=CURRENT_DATE",nativeQuery=true)
	 List<ConversationSummery> findByCurrentDate();

	 @Query(value="SELECT * FROM conversation_summery where patient_id=?1",nativeQuery=true)
	List<ConversationSummery> getConversationHistory(String patientId);
	 
	 
	 
	 //need to modify if one patient contains diffrent receptionist id
	 @Query(value="select * from conversation_summery where patient_id=?1 order By conversation_date desc limit 1",nativeQuery = true)
	 ConversationSummery getPatientLatestRecord(String patientId);

}
