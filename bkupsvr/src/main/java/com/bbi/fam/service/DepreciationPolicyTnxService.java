package com.bbi.fam.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.DepreciationPolicyTnx;
@Service(value = "depreciationPolicyTnxService")
public interface DepreciationPolicyTnxService {
   
	 DepreciationPolicyTnx save(DepreciationPolicyTnx depTnx) throws FamApplicationException;
	 DepreciationPolicyTnx findByDepPolicySeqId(String depPolicySeqId);
	 List<DepreciationPolicyTnx> findAll();
	 void delete(String id);
	 List<DepreciationPolicyTnx> findBytnxStatusCode(String tnxStatusCode);
	 public List<DepreciationPolicyTnx> getTasks(String assignee);
	// List<DepreciationPolicyTnx> findByDepreciationPolicySeqId(String depPolicySeqId);
}
