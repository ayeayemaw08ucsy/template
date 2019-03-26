package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.DepreciationProcessTxn;

@Repository
public interface DepreciationProcessTxnRepository extends JpaRepository<DepreciationProcessTxn, Long> {
	
	@Query("Select val from DepreciationProcessTxn val order by val.businessDate desc")
	List<DepreciationProcessTxn> findAll();
	
}
