package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Branch;
import com.bbi.fam.model.Vendor;

@Repository
public interface BranchRepository extends CrudRepository<Branch, String> {
	
	Branch findByBranchCode(String branch_code);

	@Modifying
	@Query("Delete From Branch brn Where brn.branchSeqId = :branchSeqId ")
	void deleteByBranchSeqId(@Param("branchSeqId") String branchSeqId);

	Branch findByBranchSeqId(String id);
	
	@Query("SELECT brn FROM Branch brn WHERE brn.activeStatus = 'Y' order by brn.businessDate desc")
	List<Branch> getAllBranches();
	
}
