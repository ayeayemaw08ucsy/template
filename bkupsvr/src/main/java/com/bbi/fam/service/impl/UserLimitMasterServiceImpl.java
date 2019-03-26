package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserLimitMasterRepository;
import com.bbi.fam.dao.UserLimitTxnRepository;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.UserLimitMaster;
import com.bbi.fam.model.UserLimitTxn;
import com.bbi.fam.service.UserLimitMasterService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "userLimitMasterService")
public class UserLimitMasterServiceImpl implements UserLimitMasterService {
	@Autowired
	private TaskService taskService;

	@Autowired
	private UserLimitMasterRepository userLimitMasterRepo;
	
	@Autowired
	private UserLimitTxnRepository userLimitTxnRepo;
	
	@Autowired
	private AccountHelperImpl accountHelper;

	public List<UserLimitMaster> findAll() {
		List<UserLimitMaster> list = new ArrayList<>();
		userLimitMasterRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	@Transactional("transactionManager")
	public UserLimitMaster save(UserLimitTxn txn) {
		taskService.complete(txn.getTaskId());
		txn.setApproveDate(new Date());
		txn.setApproveUser(accountHelper.getLoginUser().getUsername());
		txn.setTxnStatusCode("APPROVE");
		txn.setApproveDate(new Date());
		UserLimitMaster master = new UserLimitMaster(txn);
		if(master.getId() == null) {
			master.setId(CustomIdGeneration.generateTxnId(new Date()));
		}
		userLimitTxnRepo.save(txn);
		List<UserLimitTxn> limits = userLimitTxnRepo.findByLevelCode(txn.getLevelCode());
		for (UserLimitTxn limit: limits) {
			if(!limit.getTaskId().equalsIgnoreCase(txn.getTaskId())) {
				taskService.complete(limit.getTaskId());
				userLimitTxnRepo.delete(limit);
			}
		}
		return userLimitMasterRepo.save(master);
	}
}
