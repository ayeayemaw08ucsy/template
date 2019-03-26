package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.DepreciationPolicy;
import com.bbi.fam.model.DepreciationPolicyTnx;

@Repository
public interface DepreciationTnxRepository extends CrudRepository<DepreciationPolicyTnx, String> {
	List<DepreciationPolicyTnx> findBytnxStatusCode(String tnxStatusCode);
	DepreciationPolicyTnx findBydepPloicyTnxSeqId(String id);
	DepreciationPolicyTnx findByDepreciation(DepreciationPolicy depreciationPolicyMst);
	List<DepreciationPolicyTnx> findAllByDepreciation(DepreciationPolicy depreciationPolicyMst);
	
}

