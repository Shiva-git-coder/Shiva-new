package com.lawyer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.EmailVerification;

import jakarta.transaction.Transactional;

@Repository
public interface EmailVerificationRepo extends JpaRepository<EmailVerification, String> {

	@Query(value = "select * from email_verification where email=?1 and otp=?2", nativeQuery = true)
	EmailVerification getVerifyEmail(String mail, String otp);

	@Modifying
	@Transactional
	@Query(value = "delete from email_verification where otp =?1", nativeQuery = true)
	int removeRequestByOTP(String codes);

}
