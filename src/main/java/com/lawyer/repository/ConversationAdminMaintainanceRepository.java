package com.lawyer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.ConversationAdminMaintainance;

import jakarta.transaction.Transactional;

@Repository
public interface ConversationAdminMaintainanceRepository extends JpaRepository<ConversationAdminMaintainance, Long> {

	
//	@Query(value= "select exists (select * from admin_mainatainance_conversation where email =?1 )",nativeQuery = true)
//	boolean existingOrNot(String email);

	@Query(value= "select * from admin_mainatainance_conversation where email=?1",nativeQuery = true)
	ConversationAdminMaintainance findByEmail(String email);
	
	@Query(value= "select * from admin_mainatainance_conversation where email=?1 limit 1",nativeQuery = true)
	ConversationAdminMaintainance getOneRecordByEmail(String email);

	@Query(value= "select distinct department from admin_mainatainance_conversation order by department",nativeQuery = true)
	List<String> getDistinctDepts();

	@Query(value= "select * from admin_mainatainance_conversation where department=?1",nativeQuery = true)
	List<ConversationAdminMaintainance> getDoctorsByDept(String department);

	@Query(value = "select id from admin_mainatainance_conversation "
			+ "ORDER BY CAST(REGEXP_REPLACE(id, '[^0-9]', '', 'g') AS INTEGER) DESC LIMIT 1",nativeQuery = true)
	String getLastUniqNumber();

	@Query(value = "SELECT available_slots FROM admin_mainatainance_conversation WHERE id = ?1 AND date = ?2", nativeQuery = true)
	String getAllSlotsByDoctorId(String doctorId, String date);

	
	@Query(value= "select * from admin_mainatainance_conversation where id=?1 ",nativeQuery = true)
	ConversationAdminMaintainance getUserByUid(String doctorId);

	
	@Transactional
	@Modifying
	@Query(value= "delete from admin_mainatainance_conversation where id=?1",nativeQuery = true)
	int deleteByUID(String id);
	
	@Query(value= "select * from admin_mainatainance_conversation where email=?1",nativeQuery = true)
	List<ConversationAdminMaintainance> getByEmailId(String email);

}
