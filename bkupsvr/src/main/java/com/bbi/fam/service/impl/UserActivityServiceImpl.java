package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.UserActivityRepository;
import com.bbi.fam.model.UserActivity;
import com.bbi.fam.service.UserActivityService;

@Service(value = "userActivityService")
public class UserActivityServiceImpl implements UserActivityService {

	@Autowired
	private UserActivityRepository userActivityRepository;

	public List<UserActivity> findAll() {
		List<UserActivity> list = new ArrayList<>();
		userActivityRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

}
