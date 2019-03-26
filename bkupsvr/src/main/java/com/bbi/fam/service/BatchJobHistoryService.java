package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.model.BatchJobHistory;

public interface BatchJobHistoryService {

    List<BatchJobHistory> findAll();
}
