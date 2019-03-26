package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserFunction;

@Repository
public interface UserFunctionRepository extends JpaRepository<UserFunction, String> {
	void deleteByUsername(String username);
	List<UserFunction> findByUsername(String username);
}
