package com.bbi.fam.controller;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.model.Code;
import com.bbi.fam.model.DepreciationPolicy;
import com.bbi.fam.service.DepreciationPolicyService;

@RestController
@RequestMapping("/deppolicy")
public class DepreciationPolicyController {
  	
	@Autowired
    private DepreciationPolicyService depreciationService;
	
	@Value("${spring.error.duplicateerror.duplicatedeppolicy}")
	private String errorMessage;
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping(value="/policy", method = RequestMethod.GET)
	public ResponseEntity<List<DepreciationPolicy>> getDepreciationPolicy() {
		return new ResponseEntity<List<DepreciationPolicy>>(depreciationService.findAll(),HttpStatus.OK);
	}

	/**
	 * 
	 * @param depreciation
	 * @return
	 */
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<DepreciationPolicy> create(@RequestBody DepreciationPolicy depreciation){
    	return new ResponseEntity<DepreciationPolicy>(depreciationService.save(new HashSet<DepreciationPolicy>() {{
            add(depreciation);
        }}), HttpStatus.OK);
    }
    
    /**
	 * 
	 * @return
	 */
	@RequestMapping(value="/policy/{assetType}/{assetSubType}", method = RequestMethod.GET)
	public ResponseEntity<DepreciationPolicy> getDepreciationPolicyByAssetType(@PathVariable(value = "assetType") String assetType, @PathVariable(value = "assetSubType") String assetSubType) {
		return new ResponseEntity<DepreciationPolicy>(depreciationService.findByAssetTypeAndAssetSubType(assetType, assetSubType),HttpStatus.OK);
	}
    
	/**
	 * 
	 * @param assetType
	 * @param assetSubType
	 * @return
	 */
	@RequestMapping(value="/duplicate/{assetType}/{assetSubType}", method = RequestMethod.GET)
	public ResponseEntity<Object> duplicateChecking(@PathVariable(value = "assetType") String assetType, @PathVariable(value = "assetSubType") String assetSubType) {
		DepreciationPolicy depreciationPolicy = depreciationService.findByAssetTypeAndAssetSubType(assetType, assetSubType);
		  
		  if(depreciationPolicy != null) {
			  return new ResponseEntity<Object>(new ApiError(HttpStatus.BAD_REQUEST,errorMessage, "Unique Depreciation Policy"), HttpStatus.BAD_REQUEST);
		  }
		  return new ResponseEntity<Object>(HttpStatus.OK);	
	}
    
}
