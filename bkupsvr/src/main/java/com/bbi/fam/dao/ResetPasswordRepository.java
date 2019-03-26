package com.bbi.fam.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.ResetPassword;

@Repository
public interface ResetPasswordRepository extends CrudRepository<ResetPassword, Long> {
	void deleteByUsername(String username);
}

