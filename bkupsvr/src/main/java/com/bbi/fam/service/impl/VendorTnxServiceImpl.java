package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.dao.VendorTnxRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.User;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.VendorTnxService;

@Service(value = "vendorTnxService")
public class VendorTnxServiceImpl implements VendorTnxService {
	
	@Autowired
	private VendorTnxRepository vendorTnxRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	@Transactional("transactionManager")
	public VendorTnx save(VendorTnx vendorTnx) {
		return vendorTnxRepository.save(vendorTnx);
	}

	@Override
	public List<VendorTnx> findAll() {
		List<VendorTnx> list = new ArrayList<>();
		vendorTnxRepository.findAll().iterator().forEachRemaining(list::add);
		System.out.println("Service list" + list);
		return list;
	}

	@Override
	public VendorTnx findOne(String vendorTnxSeqId) {
		return vendorTnxRepository.findByVendorTnxSeqId(vendorTnxSeqId);
	}

	@Override
	public VendorTnx delete(String id) throws FamApplicationException, Exception {
		return vendorTnxRepository.deleteByVendorTnxSeqId(id);
	}

	@Override
	public VendorTnx update(VendorTnx vendorTnx) throws FamApplicationException {
		return null;
	}

	@Override
	public List<VendorTnx> getAllVendorTnx() {
		return null;
	}

	@Override
	public List<VendorTnx> findByTnxStatusCode(String tnxStatusCode) {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<VendorTnx> waitlist = new ArrayList<>();
		waitlist = vendorTnxRepository.findByTnxStatusCode(tnxStatusCode);		
		for (int i=0; i<waitlist.size(); i++) {
			if (waitlist.get(i).getInputUser().equals(loginUser.getUsername())) {
				waitlist.get(i).setAuthorize(false);
			} else {
				waitlist.get(i).setAuthorize(true);
			}
		}
		System.out.println("Wait list" + waitlist);
		return waitlist;
	}

}
