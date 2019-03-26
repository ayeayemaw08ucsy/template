package com.bbi.fam.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.UserLimitTxn;

public interface CodeValueService {
	CodeValue findOne(String codeId);
	CodeValue save(CodeValue codeValue);
	Code findByCode(Code code);
	List<CodeValue> findByCodeId(String codeId);
	CodeValue findByCodeValueAndCode(String codeValue, Code id);
	CodeValue findByCodeValueAndCodeAndIdNot(String codeValue, Code code,String id);
	List<CodeValue> findAll();
	void delete(String id);
	public List<CodeValue> findByCodeIdAndUsername(String codeId, String username);
}
