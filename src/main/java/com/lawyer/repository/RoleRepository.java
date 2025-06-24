package com.lawyer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lawyer.model.ERole;
import com.lawyer.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
	
	
	Optional<Role> findByName(ERole name);

	@Query(value = "select DISTINCT name from roles order by name", nativeQuery = true)
	String[] getAllRoles();
//	
//	@Query(value = "select * from roles", nativeQuery = true)
//	List<> getAll();
	
	
}
