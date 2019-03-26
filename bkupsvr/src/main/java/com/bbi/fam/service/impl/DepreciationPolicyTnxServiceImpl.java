package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.DepreciationRepository;
import com.bbi.fam.dao.DepreciationTnxRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.exception.FamSystemException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.DepreciationPolicy;
import com.bbi.fam.model.DepreciationPolicyTnx;
import com.bbi.fam.service.DepreciationPolicyService;
import com.bbi.fam.service.DepreciationPolicyTnxService;
import com.bbi.fam.service.UserService;
import com.bbi.fam.utils.Common;
import com.bbi.fam.utils.CustomIdGeneration;
import com.bbi.fam.model.User;

@Service(value = "depreciationPolicyTnxService")
public class DepreciationPolicyTnxServiceImpl implements DepreciationPolicyTnxService {

	@Autowired
	private DepreciationTnxRepository depTnxRepo;

	@Autowired
	private DepreciationRepository depRepo;

	@Autowired
	private AccountHelperImpl accountHelperImpl;

	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private TaskService taskService;

	@Override
	@Transactional("transactionManager")
	public DepreciationPolicyTnx save(DepreciationPolicyTnx depPolicyTnx) throws FamApplicationException {

		DepreciationPolicy depPolicy = depPolicyTnx.getDepreciation();

		String tnxStatusCode = depPolicyTnx.getTnxStatusCode();
		String userName = accountHelperImpl.getLoginUser().getUsername();

		if (depPolicy.getDepPolicySeqId() != null) {

			if (depPolicyTnx.getTnxStatusCode().equals(Common.TNX_STATUS_CODE[2])) {

				if (depRepo.findById(depPolicy.getDepPolicySeqId()) == null) {
					throw new FamApplicationException(depPolicy.getDepPolicySeqId() + " Record Not Found in Mst.");
				} else {

					depPolicyTnx.setApproveUserId(userName);
					return updateApprovedDataMst(depPolicyTnx, depPolicy);
				}

			} else {
				// update the mst and tnx.
				// DepreciationPolicyTnx tnx= depTnxRepo.findByDepreciation(depPolicy);
				DepreciationPolicyTnx tnx = null;
				List<DepreciationPolicyTnx> tnxList = depTnxRepo.findAllByDepreciation(depPolicy);
				if (tnxList.size() != 0) {
					tnx = tnxList.get(0);
				}
				return updateApprovedDataTnx(tnx, depPolicyTnx);
			}

		} else {

			// prepare data of codeValueTnx
			if (tnxStatusCode.equals(Common.TNX_STATUS_CODE[1])) {

				depPolicyTnx.setInputDateTime(new Date());
				depPolicyTnx.setInputUserId(userName);

				// depPolicyTnx.setCode(codeValueTnx.getCode());
				depPolicyTnx.setDepreciation(null);
				depPolicyTnx.setDepPloicyTnxSeqId(CustomIdGeneration.generateTxnId(new Date()));

/*				Map<String, Object> variables = new HashMap<String, Object>();
				variables.put("userList", "admin, ppa");
				variables.put("key", depPolicyTnx.getDepPloicyTnxSeqId());

				String taskId = runtimeService.startProcessInstanceByKey("depreciationPolicyProcess", variables)
						.getId();
				Task task = taskService.createTaskQuery().executionId(taskId).singleResult();*/
				
				Task task = this.startTask(depPolicyTnx);
				depPolicyTnx.setTaskId(task.getId());
			} else {
				// approve data prepare

				depPolicyTnx.setApproveUserId(userName);
				depPolicyTnx.setApproveDateTime(new Date());
				depPolicyTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[2]);

				taskService.complete(depPolicyTnx.getTaskId());
				DepreciationPolicy depPolicyMst = new DepreciationPolicy();

				depPolicyMst.setDepPolicySeqId(CustomIdGeneration.generateTxnId(new Date()));
				depPolicyMst.setAssetType(depPolicyTnx.getAssetType());
				depPolicyMst.setAssetSubType(depPolicyTnx.getAssetSubType());
				depPolicyMst.setDepMethod(depPolicyTnx.getDepMethod());
				depPolicyMst.setDepCollFrequency(depPolicyTnx.getDepCollFrequency());
				depPolicyMst.setDepUsefulLife(depPolicyTnx.getDepUsefulLife());
				depPolicyMst.setDepRate(depPolicyTnx.getDepRate());
				depPolicyMst.setBusinessDate(new Date());
				depPolicyMst.setEntity(depPolicyTnx.getEntity());

				depPolicyTnx.setDepreciation(depPolicyMst);
			}

			depPolicyTnx.setBusiness_date(new Date());
			return depTnxRepo.save(depPolicyTnx);

		}
	}

	@Override
	public DepreciationPolicyTnx findByDepPolicySeqId(String depPolicySeqId) {
		// TODO Auto-generated method stub
		return depTnxRepo.findById(depPolicySeqId).get();
	}

	@Override
	public List<DepreciationPolicyTnx> findAll() {
		List<DepreciationPolicyTnx> list = new ArrayList<>();
		depTnxRepo.findAll().iterator().forEachRemaining(list::add);

		return list;
	}

	@Override
	public void delete(String id) {
		depTnxRepo.deleteById(id);

	}

	@Override
	public List<DepreciationPolicyTnx> findBytnxStatusCode(String tnxStatusCode) {
		return depTnxRepo.findBytnxStatusCode(tnxStatusCode);
	}

	/*
	 * @Override public List<DepreciationPolicyTnx>
	 * findByDepreciationPolicySeqId(String depPolicySeqId) {
	 * 
	 * return depTnxRepo.findByDepreciationPolicySeqId(depPolicySeqId); }
	 */

	/**
	 * Get the Data for approval.
	 * 
	 * @param assignee
	 * @return
	 */
	public List<DepreciationPolicyTnx> getTasks(String assignee) {
		List<DepreciationPolicyTnx> txnList = new ArrayList<DepreciationPolicyTnx>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee)
				.processDefinitionKey("depreciationPolicyProcess").list();
		System.out.println("##############Depreciation Task List###############" + taskList.toString());
		List<Task> tasks = taskService.createTaskQuery().taskDefinitionKey("depreciationPolicyProcess").list();
		System.out.println("##############Depreciation Task List###############" + tasks.toString()); 
		for (Task task : taskList) {
				
				DepreciationPolicyTnx txn = new DepreciationPolicyTnx();
				txn = depTnxRepo.findById(task.getFormKey()).get();
				txn.setTaskId(task.getId());
				txnList.add(txn);
			
			
		}

		return txnList;
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public DepreciationPolicyTnx updateApprovedDataTnx(DepreciationPolicyTnx tnx, DepreciationPolicyTnx paramTnx) {

		DepreciationPolicyTnx newTnx = new DepreciationPolicyTnx();

		newTnx.setDepPloicyTnxSeqId(CustomIdGeneration.generateTxnId(new Date()));
		newTnx.setInputDateTime(new Date());
		newTnx.setInputUserId(accountHelperImpl.getLoginUser().getUsername());
		newTnx.setBusiness_date(new Date());
		// newTnx.setCode(tnx.getCode());
		newTnx.setDepreciation(tnx.getDepreciation());
		newTnx.setAssetType(paramTnx.getAssetType());
		newTnx.setAssetSubType(paramTnx.getAssetSubType());
		newTnx.setDepMethod(paramTnx.getDepMethod());
		newTnx.setDepCollFrequency(paramTnx.getDepCollFrequency());
		newTnx.setDepUsefulLife(paramTnx.getDepUsefulLife());
		newTnx.setDepRate(paramTnx.getDepRate());
		newTnx.setTnxStatusCode(paramTnx.getTnxStatusCode());
		newTnx.setTnxType(paramTnx.getTnxType());
		newTnx.setTnxSubType(paramTnx.getTnxSubType());

/*		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList", "admin, ppa");
		variables.put("key", newTnx.getDepPloicyTnxSeqId());
		String taskId = runtimeService.startProcessInstanceByKey("depreciationPolicyProcess", variables).getId();

		Task task = taskService.createTaskQuery().executionId(taskId).singleResult();*/
		Task task = this.startTask(newTnx);
		newTnx.setTaskId(task.getId());

		return depTnxRepo.save(newTnx);
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public DepreciationPolicyTnx updateApprovedDataMst(DepreciationPolicyTnx depPolicyTnx,
			DepreciationPolicy depPolicy) {

		depPolicyTnx.setApproveDateTime(new Date());
		depPolicyTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[2]);

		taskService.complete(depPolicyTnx.getTaskId());
		// CodeValue codeValueMst = new CodeValue();

		depPolicy.setAssetType(depPolicyTnx.getAssetType());
		depPolicy.setAssetSubType(depPolicyTnx.getAssetSubType());
		depPolicy.setDepMethod(depPolicyTnx.getDepMethod());
		depPolicy.setDepCollFrequency(depPolicyTnx.getDepCollFrequency());
		depPolicy.setDepUsefulLife(depPolicyTnx.getDepUsefulLife());
		depPolicy.setDepRate(depPolicyTnx.getDepRate());
		depPolicy.setBusinessDate(new Date());
		depPolicy.setEntity(depPolicyTnx.getEntity());
		depPolicyTnx.setDepreciation(depPolicy);

		depPolicyTnx.setBusiness_date(new Date());

		System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$Update ApproveData Mst CodeValue Tnx$$$$$$$$$$$$" + depPolicyTnx);
		return depTnxRepo.save(depPolicyTnx);
	}
   
	
	public Task startTask(DepreciationPolicyTnx depPolicyTnx) {
		
		Map<String, Object> variables = new HashMap<String, Object>();
		List<User> userList = userService.findByUsernameNot(accountHelperImpl.getLoginUser().getUsername());
		
		List<String> assignee = new ArrayList<>();
		
		for (User user: userList) {
			assignee.add(user.getUsername());
		}
		
		variables.put("userList", StringUtils.join(assignee, ","));
		variables.put("key", depPolicyTnx.getDepPloicyTnxSeqId());
		
		String taskId = runtimeService.startProcessInstanceByKey("depreciationPolicyProcess", variables)
									  .getId();
		Task task = taskService.createTaskQuery().executionId(taskId).singleResult();
		return task;
	}
	
}
