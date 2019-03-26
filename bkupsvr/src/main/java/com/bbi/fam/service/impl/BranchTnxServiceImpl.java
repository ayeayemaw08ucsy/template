package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.BranchTnxRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.BranchTnx;
import com.bbi.fam.model.User;
import com.bbi.fam.service.BranchTnxService;

@Service
public class BranchTnxServiceImpl implements BranchTnxService {
	
	@Autowired
	private BranchTnxRepository branchTnxRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	@Transactional("transactionManager")
	public BranchTnx save(BranchTnx branchTnx) {
		return branchTnxRepository.save(branchTnx);
	}

	@Override
	public List<BranchTnx> findAll() {
		List<BranchTnx> list = new ArrayList<>();
		branchTnxRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public BranchTnx findOne(String branchTnxSeqId) {
		return branchTnxRepository.findByBranchTnxSeqId(branchTnxSeqId);
	}

	@Override
	public List<BranchTnx> findByTnxStatusCode(String tnxStatusCode) {
		
		AccountHelperImpl accountHelper = new AccountHelperImpl();
		User loginUser = userRepository.findByUsername(accountHelper.getLoginUser().getUsername());
		
		List<BranchTnx> waitlist = new ArrayList<>();
		waitlist = branchTnxRepository.findByTnxStatusCode(tnxStatusCode);
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

	@Override
	@Transactional("transactionManager")
	public BranchTnx delete(String id) throws FamApplicationException, Exception {
		return null;
	}

	@Override
	@Transactional("transactionManager")
	public BranchTnx update(BranchTnx branchTnx) throws FamApplicationException {
		return null;
	}

	@Override
	public List<BranchTnx> getAllBranchTnx() {
		List<BranchTnx> list = new ArrayList<>();
		branchTnxRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

}
