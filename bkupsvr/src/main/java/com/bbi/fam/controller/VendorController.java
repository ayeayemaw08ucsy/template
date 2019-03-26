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
import com.bbi.fam.model.Vendor;
import com.bbi.fam.model.VendorTnx;
import com.bbi.fam.service.VendorService;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;
    
    @RequestMapping(value="/vendor", method = RequestMethod.GET)
    public ResponseEntity<List<Vendor>> listVendor(){
    	return new ResponseEntity<List<Vendor>>(vendorService.findAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/vendor", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Vendor vendor){
    	try {
			return new ResponseEntity<Object>(vendorService.register(vendor), HttpStatus.OK);
			
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

    @RequestMapping(value = "/vendor/{id}", method = RequestMethod.GET)
    public ResponseEntity<Vendor> findOne(@PathVariable String id){
    	return new ResponseEntity<Vendor>(vendorService.findOne(id), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/vendor/request/update/{vendorSeqId}", method = RequestMethod.PUT)
    public ResponseEntity<Object> requestForUpdate(@PathVariable(value = "vendorSeqId") String vendorSeqId, @RequestBody Vendor vendor){
    	
        vendor.setVendorSeqId(vendorSeqId);
        try {
			return new ResponseEntity<Object>(vendorService.requestForUpdate(vendor), HttpStatus.OK);
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

    @RequestMapping(value = "/vendor/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody Vendor vendor){
    	
        vendor.setVendorSeqId(id);
        try {
			return new ResponseEntity<Object>(vendorService.update(vendor), HttpStatus.OK);
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

    @RequestMapping(value = "/vendor/{vendorSeqId}", method = RequestMethod.DELETE)
    public ResponseEntity<Vendor> delete(@PathVariable(value = "vendorSeqId") String vendorSeqId) throws Exception{
    	// vendorService.delete(vendorSeqId);
    	return new ResponseEntity<Vendor>(vendorService.delete(vendorSeqId), HttpStatus.OK);
    }
    
}
