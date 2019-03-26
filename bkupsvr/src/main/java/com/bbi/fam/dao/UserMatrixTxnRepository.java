package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserMatrixTxn;

@Repository
public interface UserMatrixTxnRepository extends CrudRepository<UserMatrixTxn, String> {
	
	public List<UserMatrixTxn> findByGroupCode(String groupCode);
}
