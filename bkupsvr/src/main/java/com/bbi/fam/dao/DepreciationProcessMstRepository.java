package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.DepreciationProcessMst;

@Repository
public interface DepreciationProcessMstRepository extends JpaRepository<DepreciationProcessMst, Long> {
	
	DepreciationProcessMst findByProdRefId (String prodRefId);
	
	@Query("Select val from DepreciationProcessMst val order by val.businessDate desc")
	List<DepreciationProcessMst> findAll();
	
}
