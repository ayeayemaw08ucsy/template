package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;

@Repository
public interface CodeValueRepository extends CrudRepository<CodeValue, String> {
	
	@Query("Select val from CodeValue val where val.code.id =  ?1 and val.codeValUpdateFlag = 'Y' order by val.codeValue")
	List<CodeValue> findByCodeIdOrderByCodeValue(String codeId);
	
	//@Query("Select c from CodeValue c where c.codeValue = ?1 and c.code.id = ?2")
	//CodeValue findByCodeValueAndCode(String codeValue, String id);
	CodeValue findByCodeValueAndCode(String codeValue , Code code);
	CodeValue findByCodeValueAndCodeAndIdNot(String codeValue,Code code,String id);
	
	@Query("Select val from CodeValue val where val.codeValue = ?1 and val.codeValUpdateFlag = 'Y' ")
	CodeValue findByCodeValueAndCodeValUpdateFlag(String codeValue);
	
	@Query("Select val from CodeValue val order by val.codeValue asc")
	List<CodeValue> findAll();
}
