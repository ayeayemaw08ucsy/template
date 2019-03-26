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
import com.bbi.fam.model.BranchTnx;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.BranchService;
import com.bbi.fam.service.BranchTnxService;
import com.bbi.fam.service.VendorService;
import com.bbi.fam.service.VendorTnxService;

@RestController
@RequestMapping("/branchTnxs")
public class BranchTnxController {
	
	@Autowired
    private BranchTnxService branchTnxService;
	
	@Autowired
    private BranchService branchService;
    
    //@PreAuthorize("hasRole('ROLE_1')")
    @RequestMapping(value="/branchTnx", method = RequestMethod.GET)
    public ResponseEntity<List<BranchTnx>> listBranchTnx(){
    	return new ResponseEntity<List<BranchTnx>>(branchTnxService.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/branchTnx/findBy/{branchTnxSeqId}", method = RequestMethod.GET)
    public ResponseEntity<BranchTnx> findOne(@PathVariable(value = "branchTnxSeqId") String branchTnxSeqId){
    	return new ResponseEntity<BranchTnx>(branchTnxService.findOne(branchTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/branchTnx/{tnxStatusCode}", method = RequestMethod.GET)
    public ResponseEntity<List<BranchTnx>> findByTnxStatusCode(@PathVariable(value = "tnxStatusCode") String tnxStatusCode){
    	List<BranchTnx> list = branchTnxService.findByTnxStatusCode(tnxStatusCode);
    	System.out.println(list);
    	return new ResponseEntity<List<BranchTnx>>(branchTnxService.findByTnxStatusCode(tnxStatusCode), HttpStatus.OK);
    }

    @RequestMapping(value = "/branchTnx/update/{branchTnxSeqId}", method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@PathVariable(value = "branchTnxSeqId") String branchTnxSeqId, @RequestBody BranchTnx branchTnx){
    	
    	branchTnx.setBranchTnxSeqId(branchTnxSeqId);
        try {
			return new ResponseEntity<Object>(branchTnxService.update(branchTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }

    @RequestMapping(value = "/branchTnx/delete/{branchTnxSeqId}", method = RequestMethod.DELETE)
    public ResponseEntity<BranchTnx> delete(@PathVariable(value = "branchTnxSeqId") String branchTnxSeqId) throws Exception{
    	branchTnxService.delete(branchTnxSeqId);
    	return new ResponseEntity<BranchTnx>(branchTnxService.delete(branchTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/branchTnx/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> approve(@RequestBody BranchTnx branchTnx){
    	try {
			return new ResponseEntity<Object>(branchService.approve(branchTnx), HttpStatus.OK);
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
    
    @RequestMapping(value = "/branchTnx/update/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> updateApprove(@RequestBody BranchTnx branchTnx){
    	try {
			return new ResponseEntity<Object>(branchService.updateApprove(branchTnx), HttpStatus.OK);
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
