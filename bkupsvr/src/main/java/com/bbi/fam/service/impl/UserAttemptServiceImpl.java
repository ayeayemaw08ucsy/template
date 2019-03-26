package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserAttemptRepository;
import com.bbi.fam.model.UserAttempt;
import com.bbi.fam.service.UserAttemptService;

@Service(value = "userAttemptService")
public class UserAttemptServiceImpl implements UserAttemptService {

	@Autowired
	private UserAttemptRepository userAttemptRepo;

	public List<UserAttempt> findAll() {
		List<UserAttempt> list = new ArrayList<>();
		userAttemptRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public UserAttempt findOne(long id) {
		return userAttemptRepo.findById(id).get();
	}

	@Override
	@Transactional("transactionManager")
	public void delete(long id) {
		userAttemptRepo.deleteById(id);
	}

	@Override
	@Transactional("transactionManager")
	public UserAttempt save(UserAttempt userAttempt) {
		return userAttemptRepo.save(userAttempt);
	}

	@Override
	public UserAttempt findByUsername(String username) {
		return userAttemptRepo.findByUsername(username);
	}
}
