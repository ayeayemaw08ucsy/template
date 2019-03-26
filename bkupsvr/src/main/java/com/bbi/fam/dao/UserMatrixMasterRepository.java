package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.UserMatrixMaster;

@Repository
public interface UserMatrixMasterRepository extends CrudRepository<UserMatrixMaster, String> {
	
	List<UserMatrixMaster> findByGroupCode (String groupCode);
	
}
