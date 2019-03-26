package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserMatrixMasterRepository;
import com.bbi.fam.dao.UserMatrixTxnRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixTxn;
import com.bbi.fam.service.UserMatrixTxnService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "userMatrixTxnService")
public class UserMatrixTxnServiceImpl implements UserMatrixTxnService {

	@Autowired
	private UserMatrixTxnRepository userMatrixTxnRepo;
	
	@Autowired
	private UserMatrixMasterRepository masterRepo;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	
	@Autowired
	private AccountHelperImpl accountHelper;
	
	@Autowired
	private UserServiceImpl userService;

	public List<UserMatrixTxn> findAll() {
		List<UserMatrixTxn> list = new ArrayList<>();
		userMatrixTxnRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public UserMatrixTxn findOne(String id) {
		return userMatrixTxnRepo.findById(id).get();
	}

	@Override
	@Transactional("transactionManager")
	public void delete(String id) {
		userMatrixTxnRepo.deleteById(id);
	}

	@Override
	public UserMatrixTxn save(UserMatrixTxn userMatrixTxn) throws FamApplicationException {
		if (userMatrixTxn.getId() == null) {
			userMatrixTxn.setInputUser(accountHelper.getLoginUser().getUsername());
			userMatrixTxn.setTxnStatusCode("COMPLETE");
			userMatrixTxn.setBusinessDate(new Date());
			userMatrixTxn.setId(CustomIdGeneration.generateTxnId(new Date()));
			List<UserMatrixMaster> userMatrixList = masterRepo.findByGroupCode(userMatrixTxn.getGroupCode());
			if (userMatrixList.size() != 0) {
				throw new FamApplicationException(userMatrixTxn.getGroupCode() + " already exists.");
			}
		} else {
			UserMatrixTxn txn = userMatrixTxnRepo.findById(userMatrixTxn.getId()).get();
			userMatrixTxn.setInputUser(accountHelper.getLoginUser().getUsername());
			userMatrixTxn.setTxnStatusCode("COMPLETE");
			userMatrixTxn.setBusinessDate(new Date());
			if (!userMatrixTxn.getGroupCode().equalsIgnoreCase(txn.getGroupCode())) {
				List<UserMatrixMaster> userMatrixList = masterRepo.findByGroupCode(userMatrixTxn.getGroupCode());
				if (userMatrixList.size() != 0) {
					throw new FamApplicationException(userMatrixTxn.getGroupCode() + " already exists.");
				}
			} 
			try {
				taskService.complete(txn.getTaskId());
			} catch (ActivitiObjectNotFoundException e) {
				// TODO: handle exception
			}
		}

		Map<String, Object> variables = new HashMap<String, Object>();
		List<User> userList = userService.findByUsernameNot(accountHelper.getLoginUser().getUsername());
		List<String> users = new ArrayList<>();
		
		for (User user: userList) {
			users.add(user.getUsername());
		}
		variables.put("userList", StringUtils.join(users, ","));
		variables.put("key", userMatrixTxn.getId());
		String taskId = runtimeService.startProcessInstanceByKey("matrixProcess", variables).getId();

		Task task = taskService.createTaskQuery().executionId(taskId).singleResult();
		userMatrixTxn.setTaskId(task.getId());
		return userMatrixTxnRepo.save(userMatrixTxn);
	}

	public List<UserMatrixTxn> getTasks(String assignee) {
		List<UserMatrixTxn> txnList = new ArrayList<UserMatrixTxn>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("matrixProcess").list();
		for (Task task : taskList) {
			UserMatrixTxn txn = new UserMatrixTxn();
			txn = userMatrixTxnRepo.findById(task.getFormKey()).get();
			txn.setTaskId(task.getId());
			txnList.add(txn);
		}
		return txnList;
	}
}
