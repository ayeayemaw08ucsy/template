package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.BranchTnx;

@Repository
public interface BranchTnxRepository  extends CrudRepository<BranchTnx, Long> {
	
	BranchTnx findByBranchTnxSeqId(String branchTnxSeqId);
	BranchTnx deleteByBranchTnxSeqId(String branchTnxSeqId);
	
	@Query("SELECT btnx FROM BranchTnx btnx WHERE btnx.tnxStatusCode = :tnxStatusCode ")
	List<BranchTnx> findByTnxStatusCode(@Param("tnxStatusCode") String tnxStatusCode);
	
	@Query("SELECT btnx FROM BranchTnx btnx order by btnx.businessDate desc")
	List<BranchTnx> findAll();

}
