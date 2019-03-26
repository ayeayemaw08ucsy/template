package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.BatchJobHistoryRepository;
import com.bbi.fam.model.BatchJobHistory;
import com.bbi.fam.service.BatchJobHistoryService;

@Service(value = "batchJobService")
public class BatchJobHistoryServiceImpl implements BatchJobHistoryService {

	@Autowired
	private BatchJobHistoryRepository batchJobRepo;

	public List<BatchJobHistory> findAll() {
		List<BatchJobHistory> list = new ArrayList<>();
		batchJobRepo.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

}
