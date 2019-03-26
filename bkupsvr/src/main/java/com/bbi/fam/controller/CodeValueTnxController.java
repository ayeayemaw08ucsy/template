package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.UserLimitMaster;
import com.bbi.fam.model.UserLimitTxn;
import com.bbi.fam.service.CodeValueService;
import com.bbi.fam.service.CodeValueTnxService;

@RestController
@RequestMapping("/codevaluetnx")
public class CodeValueTnxController {
  
	 @Autowired
	 private CodeValueTnxService codeValueTnxService;
	 
	 @Autowired
	 private CodeValueService codeValueService;
	 
	 /**
	  * 
	  * @param codeValue
	  * @return
	  */
	 @RequestMapping(value = "/save", method = RequestMethod.POST)
	    public ResponseEntity<Object> createCodeValueTnx(@RequestBody CodeValueTnx codeValueTnx){
	    	
		 try {
			 
			return new ResponseEntity<Object>(codeValueTnxService.save(codeValueTnx), HttpStatus.OK);
			
		} catch (FamApplicationException ex) {
			
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
		    
	 }  	 
	 
	 
	  @RequestMapping(value="/get-tasks", method = RequestMethod.GET)
	    public ResponseEntity<List<CodeValueTnx>> getTasks(){
	    	return new ResponseEntity<List<CodeValueTnx>>(codeValueTnxService.getTasks("ppa"), HttpStatus.OK);
	    }
	  
	   
	  @RequestMapping(value = "/approve", method = RequestMethod.POST)
	  public ResponseEntity<Object> approve(@RequestBody CodeValueTnx codeValueTnx){
		  try {
				 
				return new ResponseEntity<Object>(codeValueTnxService.save(codeValueTnx), HttpStatus.OK);
				
			} catch (FamApplicationException ex) {
				
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	    }
}
