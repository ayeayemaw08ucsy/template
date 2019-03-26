package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.UserLimitTxn;

public interface CodeValueTnxService  {
	
	CodeValueTnx save(CodeValueTnx codeValueTnx) throws FamApplicationException;
	public List<CodeValueTnx> getTasks(String assignee);
}
