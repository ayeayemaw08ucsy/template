package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserLimitTxn;

@Repository
public interface UserLimitTxnRepository extends CrudRepository<UserLimitTxn, String> {
	
	public List<UserLimitTxn> findByLevelCode(String levelCode);
}
