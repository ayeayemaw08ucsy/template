package com.bbi.fam.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.WeeklyPolicyRepository;
import com.bbi.fam.model.WeeklyPolicy;
import com.bbi.fam.service.WeeklyPolicyService;

@Service(value = "weeklyPolicyService")
public class WeeklyPolicyServiceImpl implements WeeklyPolicyService {

	@Autowired
	private WeeklyPolicyRepository weeklyPolicyRepo;

	@Override
	public WeeklyPolicy findOne() {
		return weeklyPolicyRepo.findById("weeklypolicy_id").get();
	}

	@Override
	@Transactional("transactionManager")
	public WeeklyPolicy save(WeeklyPolicy weeklyPolicy) {
		return weeklyPolicyRepo.save(weeklyPolicy);
	}

}
