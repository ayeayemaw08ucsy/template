package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.DepreciationRepository;
import com.bbi.fam.model.DepreciationPolicy;
import com.bbi.fam.service.DepreciationPolicyService;

@Service(value = "depreciationService")
public class DepreciationPolicyServiceImpl implements DepreciationPolicyService {

	@Autowired
	private DepreciationRepository depRepo;

	@Override
	@Transactional("transactionManager")
	public DepreciationPolicy save(HashSet<DepreciationPolicy> depreication) {
		
		return (DepreciationPolicy) depRepo.saveAll(depreication);
	}

	@Override
	public List<DepreciationPolicy> findAll() {
		// TODO Auto-generated method stub
		List<DepreciationPolicy> list = new ArrayList<>();
		depRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public void delete(String id) {
		depRepo.findById(id);
		
	}

	@Override
	public DepreciationPolicy findOne(String depPolicySeqId) {
		// TODO Auto-generated method stub
		return depRepo.findById(depPolicySeqId).get();
	}

	@Override
	public DepreciationPolicy findByAssetTypeAndAssetSubType(String assetType, String assetSubType) {
		
		DepreciationPolicy dp = new DepreciationPolicy();
		dp = depRepo.findByAssetTypeAndAssetSubType(assetType, assetSubType);
		
		System.out.println("DP " + dp);
		return dp;
	}
	
}
