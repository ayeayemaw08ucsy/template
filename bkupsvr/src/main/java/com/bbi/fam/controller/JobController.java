package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.model.BatchJobHistory;
import com.bbi.fam.model.Job;
import com.bbi.fam.service.BatchJobHistoryService;
import com.bbi.fam.service.JobService;

@RestController
@RequestMapping("/jobs")
public class JobController {

	@Autowired
	private JobService jobService;
	
	@Autowired
	private BatchJobHistoryService jobHistoryService;

	@RequestMapping(value = "/job", method = RequestMethod.GET)
	public ResponseEntity<List<Job>> listJob() {
		return new ResponseEntity<List<Job>>(jobService.findAll(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/job-history", method = RequestMethod.GET)
	public ResponseEntity<List<BatchJobHistory>> listJobHistory() {
		return new ResponseEntity<List<BatchJobHistory>>(jobHistoryService.findAll(), HttpStatus.OK);
	}

}
