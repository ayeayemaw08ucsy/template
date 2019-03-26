package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;


public interface CodeValueTnxRepository extends CrudRepository<CodeValueTnx, String>{
	
	List<CodeValueTnx> findAllByCodeValueMst(CodeValue codeValue);
	
}
