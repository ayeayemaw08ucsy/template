package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.CodeValueTnxRepository;
import com.bbi.fam.dao.UserFunctionRepository;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.UserFunction;
import com.bbi.fam.service.CodeService;
import com.bbi.fam.service.CodeValueService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "codeValueService")
public class CodeValueServiceImpl implements CodeValueService {
	
	@Autowired
	private CodeValueRepository codeValueRepo;
	
	@Autowired
	private UserFunctionRepository userFunctionRepo;
	
	@Autowired
	private CodeService codeService;
	
	@Override
	@Transactional("transactionManager")
	public CodeValue save(CodeValue codeValue){
		
		 Code code = codeService.findOne(codeValue.getCode().getId());
    	 codeValue.setId(CustomIdGeneration.generateTxnId(new Date()));
    	 codeValue.setBusinessDate(new Date());
    	 codeValue.setCode(code);
    	 
		return codeValueRepo.save(codeValue);
	}

	@Override
	public CodeValue findOne(String codeId) {
		// TODO Auto-generated method stub
		return codeValueRepo.findById(codeId).get();
	}

	@Override
	public Code findByCode(Code code) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<CodeValue> findAll() {
		List<CodeValue> list = new ArrayList<>();
		codeValueRepo.findAll().iterator().forEachRemaining(list::add);
		
		return list;
	}

	@Override
	@Transactional("transactionManager")
	public void delete(String id) {
		codeValueRepo.deleteById(id);
		
	}

	@Override
	public List<CodeValue> findByCodeId(String codeId) {
		
		return codeValueRepo.findByCodeIdOrderByCodeValue(codeId);
	}
	
	@Override
	public List<CodeValue> findByCodeIdAndUsername(String codeId, String username) {
		List<CodeValue> templist = new ArrayList<>();
		List<CodeValue> valuelist = new ArrayList<>();
		templist = codeValueRepo.findByCodeIdOrderByCodeValue(codeId);
		List<UserFunction> functionList = userFunctionRepo.findByUsername(username);
		for (CodeValue c : templist) {
			for (UserFunction u : functionList) {
				if (u.getCode().equalsIgnoreCase(c.getCodeValue())) {
					c.setCheck(true);
				}
			}
			valuelist.add(c);
		}
		return valuelist;
	}

	@Override
	public CodeValue findByCodeValueAndCode(String codeValue, Code id) {
		
		return codeValueRepo.findByCodeValueAndCode(codeValue, id);
	
	}

	@Override
	public CodeValue findByCodeValueAndCodeAndIdNot(String codeValue, Code code, String id) {
		// TODO Auto-generated method stub
		return codeValueRepo.findByCodeValueAndCodeAndIdNot(codeValue, code, id);
	}
	

}
