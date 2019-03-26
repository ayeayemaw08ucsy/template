package com.bbi.fam.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.Holiday;
import com.bbi.fam.service.CodeService;
import com.bbi.fam.service.CodeValueService;
import com.bbi.fam.utils.CustomIdGeneration;

@RestController
@RequestMapping("/codevalue")
public class CodeValueController {
	  @Autowired
	    private CodeValueService codeValueService;
	  
	  @Autowired
	  private CodeService codeService;
	  
	  @Value("${spring.error.duplicateerror.CodeValue}")
		private String codevalue;
	  
	 /**
	  *  
	  * @param codeValue
	  * @return
	  */
	 @RequestMapping(value = "/save", method = RequestMethod.POST)
	    public ResponseEntity<CodeValue> createCodeValue(@RequestBody CodeValue codeValue){
	    	
	    	 return new ResponseEntity<CodeValue>(codeValueService.save(codeValue), HttpStatus.OK);
	    }
	 
	 /**
	  * 
	  * @return
	  */
	 @RequestMapping(value="/values", method = RequestMethod.GET)
	 public ResponseEntity<List<CodeValue>> listCodeValue(){
	   	return new ResponseEntity<List<CodeValue>>(codeValueService.findAll(),HttpStatus.OK);
	  }
	 
	 /**
	  * 
	  * @param codeValueId
	  * @param codeValue
	  * @return
	  */
	  @RequestMapping(value = "/values/{codeValueId}", method = RequestMethod.PUT)
	    public ResponseEntity<CodeValue> update(@PathVariable (value = "codeValueId") String codeValueId, @RequestBody CodeValue codeValue){
		  	codeValue.setId(codeValueId);
	        return new ResponseEntity<CodeValue>(codeValueService.save(codeValue), HttpStatus.OK);
	    }
	  
	  /**
	   * 
	   * @param id
	   * @return
	   */
	   @RequestMapping(value = "/values/{codeValueId}", method = RequestMethod.DELETE)
	    public ResponseEntity<?> delete(@PathVariable(value = "codeValueId") String id){
	    	codeValueService.delete(id);
	    	return new ResponseEntity<>(HttpStatus.OK);
	    }

	   /**
	    * give the code id and get the codeValue List.
	    * @param codeId
	    * @return
	    */
	   @RequestMapping(value="/values/{codeId}", method = RequestMethod.GET)
	   public  ResponseEntity<List<CodeValue>> getCodeValueListByCodeId(@PathVariable (value="codeId") String codeId) {
		   return new ResponseEntity<List<CodeValue>>(codeValueService.findByCodeId(codeId),HttpStatus.OK);
	   }
	   
	   @RequestMapping(value="/values/{codeId}/{username}", method = RequestMethod.GET)
	   public  ResponseEntity<List<CodeValue>> getCodeValueListByCodeId(@PathVariable (value="codeId") String codeId, @PathVariable (value="username") String username) {
		   return new ResponseEntity<List<CodeValue>>(codeValueService.findByCodeIdAndUsername(codeId, username),HttpStatus.OK);
	   }
	   
	   @RequestMapping(value="/search/{codeValue}/{code}", method = RequestMethod.GET)
	   public  ResponseEntity<Object> findByCodeValue(@PathVariable (value="codeValue") String codeValue, @PathVariable (value="code") String code, @RequestParam(value = "tnxSeqId", required = false) String id) {
		    ResponseEntity<CodeValue> duplicateCodeValue;
		    Code codeObj = new Code();
		    codeObj.setId(code);
		
		    if(id == null) {
		    	 duplicateCodeValue = new ResponseEntity<CodeValue>(codeValueService.findByCodeValueAndCode(codeValue, codeObj),HttpStatus.OK);
				   
		    }else {
		    	 duplicateCodeValue = new ResponseEntity<CodeValue>(codeValueService.findByCodeValueAndCodeAndIdNot(codeValue, codeObj, id),HttpStatus.OK);
					
		    }
		   
		    if(duplicateCodeValue.getBody() != null) {
		    	return new ResponseEntity<Object>(new ApiError(HttpStatus.BAD_REQUEST,codevalue, "Unique CodeValue"), HttpStatus.BAD_REQUEST);
		    }
		    return new ResponseEntity<Object>(HttpStatus.OK);
			  
	   }
}
