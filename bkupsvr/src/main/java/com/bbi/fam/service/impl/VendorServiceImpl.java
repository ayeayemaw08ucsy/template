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

import com.bbi.fam.dao.CodeValueRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.dao.VendorRepository;
import com.bbi.fam.dao.VendorTnxRepository;
import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.User;
import com.bbi.fam.model.Vendor;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.VendorService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "vendorService")
public class VendorServiceImpl implements VendorService {

	@Autowired
	private VendorRepository vendorRepository;
	
	@Autowired
	private VendorTnxRepository vendorTnxRepository;
	
	@Autowired
	private CodeValueRepository codeValueRepository;
	
	@Autowired
	private UserRepository	userRepository;

	public List<Vendor> findAll() {
		List<Vendor> list = new ArrayList<>();
		vendorRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}
	
	@Override
	public List<Vendor> getAllVendors() {
		List<Vendor> list = new ArrayList<>();
		vendorRepository.getAllVendors().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public Vendor findOne(String id) {
		return vendorRepository.findByVendorSeqId(id);
	}

	@Override
	@Transactional("transactionManager")
	public Vendor delete(String id) throws FamApplicationException, Exception {
		
		Vendor vendor = vendorRepository.findByVendorSeqId(id);
		vendor.setActiveStatus("N");
		vendor.setBusinessDate(new Date());
		
		CustomIdGeneration idGen = new CustomIdGeneration();
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		Date deleteDate = new Date();
		
		VendorTnx tnx = new VendorTnx();	
		tnx.setVendorTnxSeqId(idGen.generateTxnId(new Date()));
		tnx.setEntity(vendor.getEntity());
		tnx.setVendorCode(vendor.getVendorCode());
		tnx.setVendorDesc(vendor.getVendorDesc());
		tnx.setName1(vendor.getName1());
		tnx.setName2(vendor.getName2());
		tnx.setAddress(vendor.getAddress());
		tnx.setPinCode(vendor.getPinCode());
		tnx.setPhone(vendor.getPhone());
		tnx.setEmail(vendor.getEmail());
		tnx.setCountry(vendor.getCountry());
		tnx.setActiveStatus(vendor.getActiveStatus());		
		tnx.setVendor(vendor);
		tnx.setBusinessDate(new Date());
		tnx.setInputUser(loginUser.getUsername());
		tnx.setTnxType("70");
		tnx.setTnxSubType("32");
		tnx.setTnxStatusCode("02");
		tnx.setInputDate(new Date());
		
		try {
			vendorRepository.save(vendor);
			vendorTnxRepository.save(tnx);
			
		} catch(Exception ex) {
			ex.printStackTrace();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Fail to delete."));
			err.setMessage("Vendor fail to delete.");
			vendor.setApiError(err);
		}
		return vendor;		
	}

	@Override
	public Vendor save(Vendor vendor) {
		return vendorRepository.save(vendor);
	}

	@Override
	@Transactional("transactionManager")
	public Vendor register(Vendor vendor) throws FamApplicationException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Vendor checkVdr = vendorRepository.findByVendorCode(vendor.getVendorCode());
		
		System.out.println("check vdr " + checkVdr);
		if (checkVdr == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				vendor.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				
				Vendor errVdr = new Vendor();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errVdr.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			/*vendor.setVendorSeqId(idGen.generateTxnId(new Date()));
			vendor.setBusinessDate(new Date());
			vendor.setActiveStatus("Y");
			vendorRepository.save(vendor);*/
			
			VendorTnx tnx = new VendorTnx();	
			tnx.setVendorTnxSeqId(idGen.generateTxnId(new Date()));
			tnx.setEntity(vendor.getEntity());
			tnx.setVendorCode(vendor.getVendorCode());
			tnx.setVendorDesc(vendor.getVendorDesc());
			tnx.setName1(vendor.getName1());
			tnx.setName2(vendor.getName2());
			tnx.setAddress(vendor.getAddress());
			tnx.setPinCode(vendor.getPinCode());
			tnx.setPhone(vendor.getPhone());
			tnx.setEmail(vendor.getEmail());
			tnx.setCountry(vendor.getCountry());
			tnx.setActiveStatus("N");		
			//tnx.setVendor(vendor);
			tnx.setBusinessDate(new Date());
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			vendorTnxRepository.save(tnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Vendor Creation Complete."));
			apiMsg.setMessage("Vendor Code " + vendor.getVendorCode() + " has been successfully registered.");
			vendor.setApiError(apiMsg);
			
		} else {
			
			Vendor errVdr = new Vendor();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Vendor Code."));
			err.setMessage("Vendor Code " + vendor.getVendorCode() + " already exist.");
			errVdr.setApiError(err);
			
			throw new FamApplicationException("Vendor Code " + vendor.getVendorCode() + " already exist.");
		}
		
		return vendor;
	}

	@Override
	@Transactional("transactionManager")
	public Vendor update(Vendor vendor) throws FamApplicationException, SQLException  {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		vendor.setBusinessDate(new Date());		
		
		CustomIdGeneration idGen = new CustomIdGeneration();
		VendorTnx tnx = new VendorTnx();	
		tnx.setVendorTnxSeqId(idGen.generateTxnId(new Date()));
		tnx.setEntity(vendor.getEntity());
		tnx.setVendorCode(vendor.getVendorCode());
		tnx.setVendorDesc(vendor.getVendorDesc());
		tnx.setName1(vendor.getName1());
		tnx.setName2(vendor.getName2());
		tnx.setAddress(vendor.getAddress());
		tnx.setPinCode(vendor.getPinCode());
		tnx.setPhone(vendor.getPhone());
		tnx.setEmail(vendor.getEmail());
		tnx.setCountry(vendor.getCountry());
		tnx.setActiveStatus(vendor.getActiveStatus());		
		tnx.setVendor(vendor);
		tnx.setBusinessDate(new Date());
		tnx.setInputUser(loginUser.getUsername());
		tnx.setTnxType("30");
		tnx.setTnxSubType("32");
		tnx.setTnxStatusCode("02");
		tnx.setInputDate(new Date());
		
		try {
			vendorRepository.save(vendor);
			vendorTnxRepository.save(tnx);
		} catch (Exception se) {
			throw new SQLException("Fail to update " + "Vendor " + vendor.getVendorCode() + ".");
		}
		
		ApiError apiMsg = new ApiError();
		apiMsg.setStatus(HttpStatus.OK);
		apiMsg.setErrors(Arrays.asList("Vendor Edition Complete."));
		apiMsg.setMessage("Vendor Code " + vendor.getVendorCode() + " has been successfully updated.");
		vendor.setApiError(apiMsg);
		
		return vendor;
	}

	@Override
	@Transactional("transactionManager")
	public Vendor approve(VendorTnx vendorTnx) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Vendor checkVdr = vendorRepository.findByVendorCode(vendorTnx.getVendorCode());
		Vendor vendor = new Vendor();
		
		System.out.println("check vdr " + checkVdr);
		if (checkVdr == null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				vendor.setEntity(codeValue.get(0).getCodeValue());
			} else {				
				
				Vendor errVdr = new Vendor();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errVdr.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			VendorTnx tnx = vendorTnxRepository.findByVendorTnxSeqId(vendorTnx.getVendorTnxSeqId());
			
			vendor.setVendorSeqId(idGen.generateTxnId(new Date()));
			vendor.setEntity(tnx.getEntity());
			vendor.setVendorCode(tnx.getVendorCode());
			vendor.setVendorDesc(tnx.getVendorDesc());
			vendor.setName1(tnx.getName1());
			vendor.setName2(tnx.getName2());
			vendor.setAddress(tnx.getAddress());
			vendor.setPinCode(tnx.getPinCode());
			vendor.setPhone(tnx.getPhone());
			vendor.setEmail(tnx.getEmail());
			vendor.setCountry(tnx.getCountry());
			vendor.setActiveStatus("Y");		
			vendor.setBusinessDate(new Date());
			
			System.out.println("vendor code " + vendor.getVendorCode());
			
			tnx.setActiveStatus("Y");		
			tnx.setVendor(vendor);
			tnx.setBusinessDate(new Date());
			tnx.setTnxType("10");
			tnx.setTnxSubType("11");
			tnx.setTnxStatusCode("03");
			tnx.setApprUser(loginUser.getUsername());
			tnx.setApproverDate(new Date());
			
			try {
				vendorRepository.save(vendor);
				vendorTnxRepository.save(tnx);
				
			} catch (Exception se) {
				throw new SQLException("Fail to approve " + "Vendor " + vendor.getVendorCode() + ".");
			}		 
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Vendor Approved Complete."));
			apiMsg.setMessage("Vendor Code " + vendor.getVendorCode() + " has been successfully approved.");
			vendor.setApiError(apiMsg);
			
		} else {
			
			Vendor errVdr = new Vendor();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Duplicate Vendor Code."));
			err.setMessage("Vendor Code " + vendor.getVendorCode() + " already exist.");
			errVdr.setApiError(err);
			
			throw new FamApplicationException("Vendor Code " + vendor.getVendorCode() + " already exist.");
		}
		
		return vendor;
	}

	@Override
	@Transactional("transactionManager")
	public Vendor requestForUpdate(Vendor vendor) throws FamApplicationException, SQLException {
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Vendor checkVdr = vendorRepository.findByVendorCode(vendor.getVendorCode());
		
		System.out.println("check vdr " + checkVdr);
		if (checkVdr != null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				vendor.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				
				Vendor errVdr = new Vendor();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errVdr.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			/*vendor.setVendorSeqId(idGen.generateTxnId(new Date()));
			vendor.setBusinessDate(new Date());
			vendor.setActiveStatus("Y");
			vendorRepository.save(vendor);*/
			
			VendorTnx tnx = new VendorTnx();	
			tnx.setVendorTnxSeqId(idGen.generateTxnId(new Date()));
			tnx.setEntity(vendor.getEntity());
			tnx.setVendorCode(vendor.getVendorCode());
			tnx.setVendorDesc(vendor.getVendorDesc());
			tnx.setName1(vendor.getName1());
			tnx.setName2(vendor.getName2());
			tnx.setAddress(vendor.getAddress());
			tnx.setPinCode(vendor.getPinCode());
			tnx.setPhone(vendor.getPhone());
			tnx.setEmail(vendor.getEmail());
			tnx.setCountry(vendor.getCountry());
			tnx.setActiveStatus(vendor.getActiveStatus());		
			tnx.setVendor(null);
			tnx.setBusinessDate(new Date());
			tnx.setInputUser(loginUser.getUsername());
			tnx.setTnxType("30");
			tnx.setTnxSubType("32");
			tnx.setTnxStatusCode("02");
			tnx.setInputDate(new Date());
			vendorTnxRepository.save(tnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Vendor Edition Complete."));
			apiMsg.setMessage("Vendor Code " + vendor.getVendorCode() + " has been successfully submitted.");
			vendor.setApiError(apiMsg);
			
		} else {
			
			Vendor errVdr = new Vendor();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Record Not Found."));
			err.setMessage("Vendor Code " + vendor.getVendorCode() + " not found.");
			errVdr.setApiError(err);
			
			throw new FamApplicationException("Vendor Code " + vendor.getVendorCode() + " not found.");
		}
		
		return vendor;
	}

	@Override
	@Transactional("transactionManager")
	public Vendor updateApprove(VendorTnx vendorTnx) throws FamApplicationException, SQLException {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<CodeValue> codeValue = codeValueRepository.findByCodeIdOrderByCodeValue("000");
		CustomIdGeneration idGen = new CustomIdGeneration();
		Vendor checkVdr = vendorRepository.findByVendorCode(vendorTnx.getVendorCode());
		VendorTnx updTnx = vendorTnxRepository.findByVendorTnxSeqId(vendorTnx.getVendorTnxSeqId());
		
		System.out.println("check vdr " + checkVdr);
		if (checkVdr != null ) {
			
			if(codeValue != null && !codeValue.isEmpty()) {
				checkVdr.setEntity(codeValue.get(0).getCodeValue());
			} else {
				
				
				Vendor errVdr = new Vendor();
				ApiError err = new ApiError();
				err.setStatus(HttpStatus.BAD_REQUEST);
				err.setErrors(Arrays.asList("Not found Entity Code."));
				err.setMessage("Create Entity Code First.");
				errVdr.setApiError(err);
				
				throw new FamApplicationException("Create Entity Code First. ");
			}
			
			checkVdr.setBusinessDate(new Date());
			checkVdr.setVendorCode(vendorTnx.getVendorCode());
			checkVdr.setVendorDesc(vendorTnx.getVendorDesc());
			checkVdr.setName1(vendorTnx.getName1());
			checkVdr.setName2(vendorTnx.getName2());
			checkVdr.setAddress(vendorTnx.getAddress());
			checkVdr.setPinCode(vendorTnx.getPinCode());
			checkVdr.setPhone(vendorTnx.getPhone());
			checkVdr.setEmail(vendorTnx.getEmail());
			checkVdr.setCountry(vendorTnx.getCountry());
			checkVdr.setActiveStatus(vendorTnx.getActiveStatus());	
			
			updTnx.setActiveStatus(vendorTnx.getActiveStatus());
			updTnx.setVendor(checkVdr);
			updTnx.setBusinessDate(new Date());
			updTnx.setApprUser(loginUser.getUsername());
			updTnx.setApproverDate(new Date());
			updTnx.setTnxType("30");
			updTnx.setTnxSubType("32");
			updTnx.setTnxStatusCode("03");
			updTnx.setInputDate(new Date());
			
			vendorRepository.save(checkVdr);
			vendorTnxRepository.save(updTnx);
			
			ApiError apiMsg = new ApiError();
			apiMsg.setStatus(HttpStatus.OK);
			apiMsg.setErrors(Arrays.asList("Vendor Edition Complete."));
			apiMsg.setMessage("Vendor Code " + checkVdr.getVendorCode() + " has been successfully submitted.");
			checkVdr.setApiError(apiMsg);
			
		} else {
			
			Vendor errVdr = new Vendor();
			ApiError err = new ApiError();
			err.setStatus(HttpStatus.BAD_REQUEST);
			err.setErrors(Arrays.asList("Record Not Found."));
			err.setMessage("Vendor Code " + checkVdr.getVendorCode() + " not found.");
			errVdr.setApiError(err);
			
			throw new FamApplicationException("Vendor Code " + checkVdr.getVendorCode() + " not found.");
		}
		
		return checkVdr;
	}

}
