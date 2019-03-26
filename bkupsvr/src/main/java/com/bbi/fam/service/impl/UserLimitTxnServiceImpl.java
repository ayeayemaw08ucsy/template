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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserLimitMasterRepository;
import com.bbi.fam.dao.UserLimitTxnRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserLimitMaster;
import com.bbi.fam.model.UserLimitTxn;
import com.bbi.fam.service.UserLimitTxnService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "userLimitTxnService")
public class UserLimitTxnServiceImpl implements UserLimitTxnService {

	@Autowired
	private UserLimitTxnRepository userLimitTxnRepo;
	
	@Autowired
	private UserLimitMasterRepository masterRepo;
	
	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	
	@Autowired
	private AccountHelperImpl accountHelper;
	
	@Value("${spring.error.duplicateerror.levelcode}")
	private String levelcode;

	public List<UserLimitTxn> findAll() {
		List<UserLimitTxn> list = new ArrayList<>();
		userLimitTxnRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public UserLimitTxn findOne(String id) {
		return userLimitTxnRepo.findById(id).get();
	}

	@Override
	public void delete(String id) {
		userLimitTxnRepo.deleteById(id);
	}

	@Override
	public UserLimitTxn save(UserLimitTxn userLimitTxn) throws FamApplicationException {
		if (userLimitTxn.getId() == null) {
			userLimitTxn.setInputUser(accountHelper.getLoginUser().getUsername());
			userLimitTxn.setTxnStatusCode("COMPLETE");
			userLimitTxn.setBusinessDate(new Date());
			userLimitTxn.setId(CustomIdGeneration.generateTxnId(new Date()));
			List<UserLimitMaster> userLimitList = masterRepo.findByLevelCode(userLimitTxn.getLevelCode());
			if (userLimitList.size() != 0) {
				throw new FamApplicationException(levelcode);
			}
			
			List<UserLimitMaster> userLimits = masterRepo.findByInputLimitAndApproveLimit(userLimitTxn.getInputLimit(), userLimitTxn.getApproveLimit());
			if (userLimits.size() != 0) {
				throw new FamApplicationException("Input Limit " + userLimitTxn.getInputLimit() + " and Approve Limit" + userLimitTxn.getApproveLimit() + " already exists.");
			}
		} else {
			UserLimitTxn txn = userLimitTxnRepo.findById(userLimitTxn.getId()).get();
			userLimitTxn.setInputUser(accountHelper.getLoginUser().getUsername());
			userLimitTxn.setTxnStatusCode("COMPLETE");
			userLimitTxn.setBusinessDate(new Date());
			if (!userLimitTxn.getLevelCode().equalsIgnoreCase(txn.getLevelCode())) {
				List<UserLimitMaster> userLimitList = masterRepo.findByLevelCode(userLimitTxn.getLevelCode());
				if (userLimitList.size() != 0) {
					throw new FamApplicationException(userLimitTxn.getLevelCode() + " already exists.");
				}
				List<UserLimitMaster> userLimits = masterRepo.findByInputLimitAndApproveLimit(userLimitTxn.getInputLimit(), userLimitTxn.getApproveLimit());
				if (userLimits.size() != 0) {
					throw new FamApplicationException("Input Limit " + userLimitTxn.getInputLimit() + "and Approve Limit " + userLimitTxn.getApproveLimit() + " already exists.");
				}
			} else {
				List<UserLimitMaster> userLimits = masterRepo.findByInputLimitAndApproveLimit(userLimitTxn.getInputLimit(), userLimitTxn.getApproveLimit());
				if (userLimits.size() != 0) {
					if(!userLimits.get(0).getLevelCode().equalsIgnoreCase(userLimitTxn.getLevelCode())) {
						throw new FamApplicationException("Input Limit " + userLimitTxn.getInputLimit() + "and Approve Limit " + userLimitTxn.getApproveLimit() + " already exists.");
					}
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
		variables.put("key", userLimitTxn.getId());
		String taskId = runtimeService.startProcessInstanceByKey("groupProcess", variables).getId();

		Task task = taskService.createTaskQuery().executionId(taskId).singleResult();
		userLimitTxn.setTaskId(task.getId());
		return userLimitTxnRepo.save(userLimitTxn);
	}

	public List<UserLimitTxn> getTasks(String assignee) {
		List<UserLimitTxn> txnList = new ArrayList<UserLimitTxn>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("groupProcess").list();
		for (Task task : taskList) {
			UserLimitTxn txn = new UserLimitTxn();
			txn = userLimitTxnRepo.findById(task.getFormKey()).get();
			txn.setTaskId(task.getId());
			txnList.add(txn);
		}
		return txnList;
	}
}
