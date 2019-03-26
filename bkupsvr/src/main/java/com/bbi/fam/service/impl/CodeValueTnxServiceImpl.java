package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.CodeValueTnxRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.service.CodeValueTnxService;
import com.bbi.fam.utils.Common;
import com.bbi.fam.utils.CustomIdGeneration;


@Service(value = "codeValueTnxService")
public class CodeValueTnxServiceImpl implements CodeValueTnxService{

	@Autowired
	private CodeValueTnxRepository codeValueTnxRepo;
	
	@Autowired
	private CodeValueRepository codeValueMstRepo;
	
	@Autowired
	private AccountHelperImpl accountHelperImpl;
	

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	
	@Override
	@Transactional("transactionManager")
	public CodeValueTnx save(CodeValueTnx codeValueTnx) throws FamApplicationException {

		CodeValue codeValue = codeValueTnx.getCodeValueMst();
	 String tnxStatusCode = codeValueTnx.getTnxStatusCode();
	 String userName = accountHelperImpl.getLoginUser().getUsername();
	 
	 if(codeValue.getId() != null) {
		 
		 if(codeValueTnx.getTnxStatusCode().equals(Common.TNX_STATUS_CODE[2])) {
			
			 if(codeValueMstRepo.findById(codeValue.getId()) == null) {
				 throw new FamApplicationException(codeValue.getId() + " Record Not Found in Mst.");
			 }else {
				 	
				 codeValueTnx.setApproveUserId(userName);
				 return updateApprovedDataMst(codeValueTnx, codeValue);
			 }
			
		 }else {
			 	//update the mst and tnx.
				//CodeValueTnx  tnx= codeValueTnxRepo.findByCodeValueMst(codeValue);
    		 	CodeValueTnx tnx = null;
    		 	List<CodeValueTnx> tnxList=codeValueTnxRepo.findAllByCodeValueMst(codeValue);
    		 	if(tnxList.size() != 0) {
			 	    tnx = tnxList.get(0);
			 	}else {
			 		throw new FamApplicationException("ID"+ codeValue.getId() +" Not Found In Tnx. ");
			 	}
			 	return updateApprovedDataTnx(tnx , codeValueTnx);
		 }
		
	  }else {
		  
		//prepare data of codeValueTnx 
			 if(tnxStatusCode.equals(Common.TNX_STATUS_CODE[1])) {
				 
				 codeValueTnx.setInputDateTime(new Date());
			   	 codeValueTnx.setInputUserId(userName);
			   	 
			   	 codeValueTnx.setCode(codeValueTnx.getCode());
			   	 codeValueTnx.setCodeValueMst(null);
			   	 codeValueTnx.setCodeValueTnxSeqId(CustomIdGeneration.generateTxnId(new Date()));
			   	
				Map<String, Object> variables = new HashMap<String, Object>();
				variables.put("userList", "admin, ppa");
				variables.put("key", codeValueTnx.getCodeValueTnxSeqId());
				
				String taskId = runtimeService.startProcessInstanceByKey("codevalueProcess", variables).getId();
				Task task = taskService.createTaskQuery().executionId(taskId).singleResult();
				codeValueTnx.setTaskId(task.getId());
		   }
		   else {
				 //approve data prepare
			
			    codeValueTnx.setApproveUserId(userName);
				codeValueTnx.setApproveDateTime(new Date());
				codeValueTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[2]);
				
				taskService.complete(codeValueTnx.getTaskId());
				CodeValue codeValueMst = new CodeValue();
				
				codeValueMst.setId(CustomIdGeneration.generateTxnId(new Date()));
				codeValueMst.setLongDesc(codeValueTnx.getLongDesc());
				codeValueMst.setShortDesc(codeValueTnx.getShortDesc());
				codeValueMst.setParentType(codeValueTnx.getParentType());
				codeValueMst.setCodeValue(codeValueTnx.getCodeValue());
				codeValueMst.setBusinessDate(new Date());
				codeValueMst.setCodeValUpdateFlag(codeValueTnx.getCodeValUpdateFlag());
				codeValueMst.setCode(codeValueTnx.getCode());
				
				codeValueTnx.setCodeValueMst(codeValueMst);
			 }
		   	 
			 
		   	 codeValueTnx.setBusinessDate(new Date());  	
			return codeValueTnxRepo.save(codeValueTnx);
		  
	  }
	 
	 
	}
	
	/**
	 * Get the Data for approval.
	 * @param assignee
	 * @return
	 */
	public List<CodeValueTnx> getTasks(String assignee) {
		List<CodeValueTnx> txnList = new ArrayList<CodeValueTnx>();
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(assignee).processDefinitionKey("codevalueProcess").list();
		for (Task task : taskList) {
			CodeValueTnx txn = new CodeValueTnx();
			txn = codeValueTnxRepo.findById(task.getFormKey()).get();
			txn.setTaskId(task.getId());
			txnList.add(txn);
		}
		return txnList;
	}
	

	@Transactional("transactionManager")
	public CodeValueTnx updateApprovedDataTnx(CodeValueTnx tnx , CodeValueTnx paramTnx) {
		
		CodeValueTnx newTnx = new CodeValueTnx();
		
		newTnx.setCodeValueTnxSeqId(CustomIdGeneration.generateTxnId(new Date()));
		newTnx.setInputDateTime(new Date());
		newTnx.setInputUserId(accountHelperImpl.getLoginUser().getUsername());
		newTnx.setBusinessDate(new Date());
		newTnx.setCode(tnx.getCode());
		newTnx.setCodeValueMst(tnx.getCodeValueMst());
		newTnx.setCodeValue(paramTnx.getCodeValue());
		newTnx.setCodeValUpdateFlag(paramTnx.getCodeValUpdateFlag());
		newTnx.setParentType(paramTnx.getParentType());
		newTnx.setShortDesc(paramTnx.getShortDesc());
		newTnx.setLongDesc(paramTnx.getLongDesc());
		newTnx.setTnxStatusCode(paramTnx.getTnxStatusCode());
		newTnx.setTnxType(paramTnx.getTnxType());
		newTnx.setTnxSubType(paramTnx.getTnxSubType());
		
	   	Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("userList", "admin, ppa");
		variables.put("key", newTnx.getCodeValueTnxSeqId());
		String taskId = runtimeService.startProcessInstanceByKey("codevalueProcess", variables).getId();

		Task task = taskService.createTaskQuery().executionId(taskId).singleResult();
		newTnx.setTaskId(task.getId());
		return codeValueTnxRepo.save(newTnx);
	}
	
	@Transactional("transactionManager")
	public CodeValueTnx updateApprovedDataMst(CodeValueTnx codeValueTnx, CodeValue codeValue) {
		
		
		codeValueTnx.setApproveDateTime(new Date());
		codeValueTnx.setTnxStatusCode(Common.TNX_STATUS_CODE[2]);
		
		taskService.complete(codeValueTnx.getTaskId());
		//CodeValue codeValueMst = new CodeValue();
		
		codeValue.setLongDesc(codeValueTnx.getLongDesc());
		codeValue.setShortDesc(codeValueTnx.getShortDesc());
		codeValue.setParentType(codeValueTnx.getParentType());
		codeValue.setCodeValue(codeValueTnx.getCodeValue());
		codeValue.setCodeValUpdateFlag(codeValueTnx.getCodeValUpdateFlag());
		codeValue.setCode(codeValueTnx.getCode());
		codeValue.setBusinessDate(new Date());
		codeValueTnx.setCodeValueMst(codeValue);
		
		codeValueTnx.setBusinessDate(new Date()); 
		
		return codeValueTnxRepo.save(codeValueTnx);
	}
}
