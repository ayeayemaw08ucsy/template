package com.bbi.fam.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserAttempt;

@Repository
public interface UserAttemptRepository extends JpaRepository<UserAttempt, Long> {
	UserAttempt findByUsername(String username);
}
