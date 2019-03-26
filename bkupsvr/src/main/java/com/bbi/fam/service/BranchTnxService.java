package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.BranchTnx;

public interface BranchTnxService {
	
	BranchTnx save(BranchTnx branchTnx);
    List<BranchTnx> findAll();
    BranchTnx findOne(String branchTnxSeqId);
    List<BranchTnx> findByTnxStatusCode(String tnxStatusCode);
    BranchTnx delete(String id) throws FamApplicationException, Exception;
    BranchTnx update(BranchTnx branchTnx)throws FamApplicationException;
    List<BranchTnx> getAllBranchTnx();

}
