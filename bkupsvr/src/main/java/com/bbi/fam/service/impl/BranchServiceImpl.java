package com.bbi.fam.service.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.BranchRepository;
import com.bbi.fam.dao.BranchTnxRepository;
import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.Branch;
import com.bbi.fam.model.BranchTnx;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.User;
import com.bbi.fam.model.Vendor;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.BranchService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service
public class BranchServiceImpl implements BranchService {
	
	@Autowired
	private BranchRepository branchRepository;
	
	@Autowired
	private BranchTnxRepository branchTnxRepository;
	
	@Autowired
	private CodeValueRepository codeValueRepository;
	
	@Autowired
	private UserRepository	userRepository;
	
	@Override
	@Transactional("transactionManager")
	public Branch save(Branch branch) {
		return branchRepository.save(branch);
	}
	
	@Override
	@Transactional("transactionManager")
	public BranchTnx saveTnx(BranchTnx branchTnx) {
		return branchTnxRepository.save(branchTnx);
	}

	@Override
	@Transactional("transactionManager")
	public Branch register(Branch branch) throws FamApplicationException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		Branch checkBrn = branchRepository.findByBranchCode(branch.getBranchCode());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		
		System.out.println("check brn " + checkBrn);
		if (checkBrn == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				branch.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				Branch errBrn = new Branch();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				branch.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			/*branch.setBranchSeqId(idGen.generateTxnId(new Date()));
			branch.setBusinessDate(new Date());
			branch.setActiveStatus("Y");
			branchRepository.save(branch);*/
			
			BranchTnx tnx = new BranchTnx();	
			tnx.setBranchTnxSeqId(idGen.generateTxnId(new Date()));
			tnx.setEntity(branch.getEntity());
			tnx.setBranchCode(branch.getBranchCode());
			tnx.setBranchDesc(branch.getBranchDesc());
			tnx.setName1(branch.getName1());
			tnx.setName2(branch.getName2());
			tnx.setAddress(branch.getAddress());
			tnx.setPinCode(branch.getPinCode());
			tnx.setCountry(branch.getCountry());
			tnx.setRegion(branch.getRegion());
			tnx.setActiveStatus(branch.getActiveStatus());		
			// tnx.setBranch(branch);
			tnx.setBusinessDate(new Date());
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			branchTnxRepository.save(tnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Branch Creation Complete."));
			apiMsg.setMessage("Branch Code " + branch.getBranchCode() + " is created successfully.");
			branch.setApiError(apiMsg);
			
		} else {			
			Branch errBrn = new Branch();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Branch Code."));
			err.setMessage("Branch Code " + branch.getBranchCode() + " already exist.");
			branch.setApiError(err);
			
			throw new FamApplicationException("Branch Code " + branch.getBranchCode() + " already exist.");
		}
		return branch;
	}

	@Override
	public List<Branch> findAll() {
		List<Branch> list = new ArrayList<>();
		branchRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}
	
	@Override
	public List<Branch> getAllBranches() {
		List<Branch> list = new ArrayList<>();
		branchRepository.getAllBranches().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public Branch findOne(String id) {
		return branchRepository.findByBranchSeqId(id);
	}

	@Override
	@Transactional("transactionManager")
	public Branch delete(String id) throws FamApplicationException, Exception {
		
		Branch branch =  branchRepository.findByBranchSeqId(id);
		branch.setBusinessDate(new Date());
		branch.setActiveStatus("N");
		
		CustomIdGeneration idGen = new CustomIdGeneration();
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		BranchTnx tnx = new BranchTnx();	
		tnx.setBranchTnxSeqId(idGen.generateTxnId(new Date()));
		tnx.setEntity(branch.getEntity());
		tnx.setBranchCode(branch.getBranchCode());
		tnx.setBranchDesc(branch.getBranchDesc());
		tnx.setName1(branch.getName1());
		tnx.setName2(branch.getName2());
		tnx.setAddress(branch.getAddress());
		tnx.setPinCode(branch.getPinCode());
		tnx.setCountry(branch.getCountry());
		tnx.setRegion(branch.getRegion());
		tnx.setActiveStatus(branch.getActiveStatus());		
		tnx.setBranch(branch);
		tnx.setBusinessDate(new Date());
		tnx.setInputUser(loginUser.getUsername());
		tnx.setTnxType("70");
		tnx.setTnxSubType("32");
		tnx.setTnxStatusCode("02");
		tnx.setInputDate(new Date());
		
		try {
			branchRepository.save(branch);
			branchTnxRepository.save(tnx);
			
		} catch(Exception ex) {
			ex.printStackTrace();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Fail to delete."));
			err.setMessage("Branch fail to delete.");
			branch.setApiError(err);
		}
		return branch;	
	}

	@Override
	@Transactional("transactionManager")
	public Branch update(Branch branch) throws FamApplicationException {

		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		/*branch.setActiveStatus("Y");*/
		branch.setBusinessDate(new Date());
		branchRepository.save(branch);
		
		CustomIdGeneration idGen = new CustomIdGeneration();
		BranchTnx tnx = new BranchTnx();	
		tnx.setBranchTnxSeqId(idGen.generateTxnId(new Date()));
		tnx.setEntity(branch.getEntity());
		tnx.setBranchCode(branch.getBranchCode());
		tnx.setBranchDesc(branch.getBranchDesc());
		tnx.setName1(branch.getName1());
		tnx.setName2(branch.getName2());
		tnx.setAddress(branch.getAddress());
		tnx.setPinCode(branch.getPinCode());
		tnx.setCountry(branch.getCountry());
		tnx.setRegion(branch.getRegion());
		tnx.setActiveStatus(branch.getActiveStatus());		
		tnx.setBranch(branch);
		tnx.setBusinessDate(new Date());
		tnx.setInputUser(loginUser.getUsername());
		tnx.setTnxType("30");
		tnx.setTnxSubType("32");
		tnx.setTnxStatusCode("02");
		tnx.setInputDate(new Date());
		branchTnxRepository.save(tnx);
		
		ApiError apiMsg = new ApiError();
		apiMsg.setStatus(HttpStatus.OK);
		apiMsg.setErrors(Arrays.asList("Branch Edition Complete."));
		apiMsg.setMessage("Branch Code " + branch.getBranchCode() + " is updated successfully.");
		branch.setApiError(apiMsg);
		
		return branch;
	}

	@Override
	@Transactional("transactionManager")
	public Branch approve(BranchTnx branchTnx) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		Branch checkBrn = branchRepository.findByBranchCode(branchTnx.getBranchCode());		
		CustomIdGeneration idGen = new CustomIdGeneration();
		Branch branch = new Branch();
		
		System.out.println("check brn " + checkBrn);
		if (checkBrn == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				branch.setEntity(codeValue.get(0).getCodeValue());
			} else {				
				
				Branch errBrn = new Branch();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				branch.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			BranchTnx tnx = branchTnxRepository.findByBranchTnxSeqId(branchTnx.getBranchTnxSeqId());
			
			branch.setBranchSeqId(idGen.generateTxnId(new Date()));
			branch.setEntity(tnx.getEntity());
			branch.setBranchCode(tnx.getBranchCode());
			branch.setBranchDesc(tnx.getBranchDesc());
			branch.setName1(tnx.getName1());
			branch.setName2(tnx.getName2());
			branch.setAddress(tnx.getAddress());
			branch.setPinCode(tnx.getPinCode());
			branch.setCountry(tnx.getCountry());
			branch.setRegion(tnx.getRegion());
			branch.setActiveStatus("Y");		
			branch.setBusinessDate(new Date());
			
			System.out.println("branch code " + branch.getBranchCode());
			
			tnx.setActiveStatus("Y");		
			tnx.setBranch(branch);
			tnx.setBusinessDate(new Date());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("03");
			tnx.setApprUser(loginUser.getUsername());
			tnx.setApproverDate(new Date());
			
			try {
				branchRepository.save(branch);
				branchTnxRepository.save(tnx);
				
			} catch (Exception se) {
				throw new SQLException("Fail to approve " + "Branch " + branch.getBranchCode() + ".");
			}		 
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Branch Approved Complete."));
			apiMsg.setMessage("Branch Code " + branch.getBranchCode() + " has been successfully approved.");
			branch.setApiError(apiMsg);
			
		} else {
			
			Branch errVdr = new Branch();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Vendor Code."));
			err.setMessage("Branch Code " + branch.getBranchCode() + " already exist.");
			errVdr.setApiError(err);
			
			throw new FamApplicationException("Branch Code " + branch.getBranchCode() + " already exist.");
		}
		
		return branch;
	}

	@Override
	@Transactional("transactionManager")
	public Branch requestForUpdate(Branch branch) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Branch checkBrn = branchRepository.findByBranchCode(branch.getBranchCode());
		Branch msgBrn = new Branch();
		
		System.out.println("check branch " + checkBrn);
		if (checkBrn != null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				branch.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				
				Branch errBrn = new Branch();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errBrn.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			BranchTnx tnx = new BranchTnx();	
			tnx.setBranchTnxSeqId(idGen.generateTxnId(new Date()));
			tnx.setEntity(branch.getEntity());
			tnx.setBranchCode(branch.getBranchCode());
			tnx.setBranchDesc(branch.getBranchDesc());
			tnx.setName1(branch.getName1());
			tnx.setName2(branch.getName2());
			tnx.setAddress(branch.getAddress());
			tnx.setPinCode(branch.getPinCode());
			tnx.setCountry(branch.getCountry());
			tnx.setRegion(branch.getRegion());
			tnx.setActiveStatus(branch.getActiveStatus());		
			tnx.setBranch(checkBrn);
			tnx.setBusinessDate(new Date());
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("30");
			tnx.setTnxSubType("32");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			System.out.println("Request For Update " + tnx.getBranch() + checkBrn.getActiveStatus());
			
			branchTnxRepository.save(tnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Branch Edition Complete."));
			apiMsg.setMessage("Branch Code " + branch.getBranchCode() + " has been successfully submitted.");
			msgBrn.setApiError(apiMsg);
			
		} else {
			
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Record Not Found."));
			err.setMessage("Branch Code " + branch.getBranchCode() + " not found.");
			msgBrn.setApiError(err);
			
			throw new FamApplicationException("Branch Code " + branch.getBranchCode() + " not found.");
		}
		
		return msgBrn;
	}

	@Override
	@Transactional("transactionManager")
	public Branch updateApprove(BranchTnx branchTnx) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Branch checkBrn = branchRepository.findByBranchCode(branchTnx.getBranchCode());
		BranchTnx updTnx = branchTnxRepository.findByBranchTnxSeqId(branchTnx.getBranchTnxSeqId());
		
		System.out.println("check Brn " + checkBrn);
		if (checkBrn != null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				checkBrn.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				
				Vendor errVdr = new Vendor();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errVdr.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			checkBrn.setBusinessDate(new Date());
			checkBrn.setBranchCode(branchTnx.getBranchCode());
			checkBrn.setBranchDesc(branchTnx.getBranchDesc());
			checkBrn.setName1(branchTnx.getName1());
			checkBrn.setName2(branchTnx.getName2());
			checkBrn.setAddress(branchTnx.getAddress());
			checkBrn.setPinCode(branchTnx.getPinCode());
			checkBrn.setCountry(branchTnx.getCountry());
			checkBrn.setRegion(branchTnx.getRegion());
			checkBrn.setActiveStatus(branchTnx.getActiveStatus());	
			
			updTnx.setActiveStatus(branchTnx.getActiveStatus());
			updTnx.setBranch(checkBrn);
			updTnx.setBusinessDate(new Date());
			updTnx.setApprUser(loginUser.getUsername());
			updTnx.setApproverDate(new Date());
			updTnx.setTnxType("30");
			updTnx.setTnxSubType("32");
			updTnx.setTnxStatusCode("03");
			updTnx.setInputDate(new Date());
			
			branchRepository.save(checkBrn);
			branchTnxRepository.save(updTnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Vendor Edition Complete."));
			apiMsg.setMessage("Branch Code " + checkBrn.getBranchCode() + " has been successfully submitted.");
			checkBrn.setApiError(apiMsg);
			
		} else {
			
			Branch errBrn = new Branch();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Record Not Found."));
			err.setMessage("Branch Code " + checkBrn.getBranchCode() + " not found.");
			errBrn.setApiError(err);
			
			throw new FamApplicationException("Vendor Code " + checkBrn.getBranchCode() + " not found.");
		}
		
		return checkBrn;
	}

}
