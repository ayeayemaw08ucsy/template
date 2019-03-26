package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.FamJobRepository;
import com.bbi.fam.model.Job;
import com.bbi.fam.service.JobService;

@Service(value = "jobService")
public class JobServiceImpl implements JobService {

	@Autowired
	private FamJobRepository jobRepo;

	public List<Job> findAll() {
		List<Job> list = new ArrayList<>();
		jobRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

}
