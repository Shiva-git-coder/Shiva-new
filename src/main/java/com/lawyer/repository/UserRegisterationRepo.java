package com.lawyer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.UserRegistration;

@Repository
public interface UserRegisterationRepo extends JpaRepository<UserRegistration, Long> {
	
	@Query(value = "SELECT * FROM user_registeration WHERE user_name = ?1", nativeQuery = true)
	Optional<UserRegistration> findByUserName(String userName);


}
