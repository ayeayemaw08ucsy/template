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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.VendorService;
import com.bbi.fam.service.VendorTnxService;

@RestController
@RequestMapping("/vendorTnxs")
public class VendorTnxController {
	
	@Autowired
    private VendorTnxService vendorTnxService;
	
	@Autowired
    private VendorService vendorService;
    
    @RequestMapping(value="/vendorTnx", method = RequestMethod.GET)
    public ResponseEntity<List<VendorTnx>> listVendor(){
		List<VendorTnx> tnxList = vendorTnxService.findAll();
    	return new ResponseEntity<List<VendorTnx>>(vendorTnxService.findAll(), HttpStatus.OK);
    }
	
    @RequestMapping(value = "/vendorTnx/findBy/{vendorTnxSeqId}", method = RequestMethod.GET)
    public ResponseEntity<VendorTnx> findOne(@PathVariable(value = "vendorTnxSeqId") String vendorTnxSeqId){
    	return new ResponseEntity<VendorTnx>(vendorTnxService.findOne(vendorTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/vendorTnx/{tnxStatusCode}", method = RequestMethod.GET)
    public ResponseEntity<List<VendorTnx>> findByTnxStatusCode(@PathVariable(value = "tnxStatusCode") String tnxStatusCode){
    	List<VendorTnx> list = vendorTnxService.findByTnxStatusCode(tnxStatusCode);
    	System.out.println(list);
    	return new ResponseEntity<List<VendorTnx>>(vendorTnxService.findByTnxStatusCode(tnxStatusCode), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/vendorTnx/update/{vendorTnxSeqId}", method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@PathVariable(value = "vendorTnxSeqId") String vendorTnxSeqId, @RequestBody VendorTnx vendorTnx){
    	
        vendorTnx.setVendorTnxSeqId(vendorTnxSeqId);
        try {
			return new ResponseEntity<Object>(vendorTnxService.update(vendorTnx), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }
	
    @RequestMapping(value = "/vendorTnx/delete/{vendorTnxSeqId}", method = RequestMethod.DELETE)
    public ResponseEntity<VendorTnx> delete(@PathVariable(value = "vendorTnxSeqId") String vendorTnxSeqId) throws Exception{
    	// vendorService.delete(vendorSeqId);
    	return new ResponseEntity<VendorTnx>(vendorTnxService.delete(vendorTnxSeqId), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/vendorTnx/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> approve(@RequestBody VendorTnx vendorTnx){
    	try {
			return new ResponseEntity<Object>(vendorService.approve(vendorTnx), HttpStatus.OK);
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
    
    @RequestMapping(value = "/vendorTnx/update/approve", method = RequestMethod.POST)
    public ResponseEntity<Object> updateApprove(@RequestBody VendorTnx vendorTnx){
    	try {
			return new ResponseEntity<Object>(vendorService.updateApprove(vendorTnx), HttpStatus.OK);
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
