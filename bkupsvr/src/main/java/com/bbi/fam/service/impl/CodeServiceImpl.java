package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.CodeRepository;
import com.bbi.fam.model.Code;
import com.bbi.fam.service.CodeService;

@Service(value = "codeService")
public class CodeServiceImpl implements CodeService {

	@Autowired
	private CodeRepository codeRepo;

	@Override
	@Transactional("transactionManager")
	public List<Code> findAll() {
		List<Code> list = new ArrayList<>();
		codeRepo.findAllSorted().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	@Transactional("transactionManager")
	public Code findOne(String id) {
		return codeRepo.findById(id).get();
	}

	@Override
	@Transactional("transactionManager")
	public void delete(String id) {
		codeRepo.deleteById(id);
	}

	@Override
	@Transactional("transactionManager")
	public Code save(Code code) {
		return codeRepo.save(code);
	}
	
}
