package com.bbi.fam.controller;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Branch;
import com.bbi.fam.model.Vendor;
import com.bbi.fam.service.BranchService;

@RestController
@RequestMapping(value = "/branches")
public class BranchController {
	
	
	@Autowired
	private BranchService branchService;
	
	@RequestMapping(value = "/branch", method = RequestMethod.POST)
    /*public ResponseEntity<Branch> create(@RequestBody Branch branch, @PathVariable String status,  
    		@PathVariable String branchCode,  @PathVariable String branchName, @PathVariable String region, @RequestParam("depts") List<String> deptList){*/
	public ResponseEntity<Object> create(@RequestBody Branch branch){
		
		try {
			return new ResponseEntity<Object>(branchService.register(branch), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }
	
	 @RequestMapping(value="/branch", method = RequestMethod.GET)
	 public ResponseEntity<List<Branch>> listBranch(){
	    return new ResponseEntity<List<Branch>>(branchService.findAll(), HttpStatus.OK);
	 }

	@RequestMapping(value = "/branch/{branchSeqId}", method = RequestMethod.GET)
	public ResponseEntity<Branch> findOne(@PathVariable String branchSeqId) {
		return new ResponseEntity<Branch>(branchService.findOne(branchSeqId), HttpStatus.OK);
	}

	@RequestMapping(value = "/branch/{branchSeqId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> update(@PathVariable String branchSeqId, @RequestBody Branch branch) {
		branch.setBranchSeqId(branchSeqId);
		 try {
				return new ResponseEntity<Object>(branchService.update(branch), HttpStatus.OK);
			} catch (FamApplicationException ex) {
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	}

	@RequestMapping(value = "/branch/{branchSeqId}", method = RequestMethod.DELETE)
	public ResponseEntity<Branch> delete(@PathVariable(value = "branchSeqId") String branchSeqId) throws Exception {
		// branchService.delete(branchSeqId);
		return new ResponseEntity<Branch>(branchService.delete(branchSeqId), HttpStatus.OK);
	}
	
	 @RequestMapping(value = "/branch/request/update/{branchSeqId}", method = RequestMethod.PUT)
	    public ResponseEntity<Object> requestForUpdate(@PathVariable(value = "branchSeqId") String branchSeqId, @RequestBody Branch branch){
	    	
		  branch.setBranchSeqId(branchSeqId);
	        try {
				return new ResponseEntity<Object>(branchService.requestForUpdate(branch), HttpStatus.OK);
			} catch (FamApplicationException ex) {
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			} catch (SQLException se) {
				String error = se.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , se.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	    }

}
