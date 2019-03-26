package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserMatrixMasterRepository;
import com.bbi.fam.dao.UserMatrixTxnRepository;
import com.bbi.fam.dao.UserMatrixMasterRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.UserLimitTxn;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixTxn;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.service.UserMatrixMasterService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "userMatrixMasterService")
public class UserMatrixMasterServiceImpl implements UserMatrixMasterService {

	@Autowired
	private TaskService taskService;

	@Autowired
	private UserMatrixMasterRepository userMatrixMasterRepo;
	
	@Autowired
	private UserMatrixTxnRepository userMatrixTxnRepo;
	
	@Autowired
	private AccountHelperImpl accountHelper;


	public List<UserMatrixMaster> findAll() {
		List<UserMatrixMaster> list = new ArrayList<>();
		userMatrixMasterRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Transactional("transactionManager")
	public UserMatrixMaster save(UserMatrixTxn txn){
		taskService.complete(txn.getTaskId());
		txn.setApproveDate(new Date());
		txn.setApproveUser(accountHelper.getLoginUser().getUsername());
		txn.setTxnStatusCode("APPROVE");
		txn.setApproveDate(new Date());
		UserMatrixMaster master = new UserMatrixMaster(txn);
		if(master.getId() == null) {
			master.setId(CustomIdGeneration.generateTxnId(new Date()));
		}
		userMatrixTxnRepo.save(txn);
		List<UserMatrixTxn> groups = userMatrixTxnRepo.findByGroupCode(txn.getGroupCode());
		for (UserMatrixTxn group: groups) {
			if(!group.getTaskId().equalsIgnoreCase(txn.getTaskId())) {
				taskService.complete(group.getTaskId());
				userMatrixTxnRepo.delete(group);
			}
		}
		return userMatrixMasterRepo.save(master);
	}

}
