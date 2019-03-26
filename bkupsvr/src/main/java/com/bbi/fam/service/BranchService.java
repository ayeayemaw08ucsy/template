package com.bbi.fam.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.util.MultiValueMap;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Branch;
import com.bbi.fam.model.BranchTnx;
import com.bbi.fam.model.Vendor;
import com.bbi.fam.model.VendorTnx;

public interface BranchService {
	
	Branch save(Branch branch);
	BranchTnx saveTnx(BranchTnx branchTnx);
	Branch register(Branch branch)throws FamApplicationException;
    List<Branch> findAll();
    Branch findOne(String id);
    Branch delete(String id)throws FamApplicationException, Exception;
    Branch update(Branch branch)throws FamApplicationException;
    List<Branch> getAllBranches();
    Branch approve(BranchTnx branchTnx)throws FamApplicationException, SQLException ;
	Branch requestForUpdate(Branch branch)throws FamApplicationException, SQLException ;
	Branch updateApprove(BranchTnx branchTnx)throws FamApplicationException, SQLException ;
}
