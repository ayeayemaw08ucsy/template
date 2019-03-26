package com.bbi.fam.controller;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.service.CodeService;
import com.bbi.fam.utils.CustomIdGeneration;

@RestController
@RequestMapping("/codes")
public class CodeController {

    @Autowired
    private CodeService codeService;

    //@PreAuthorize("hasRole('ROLE_1')")
    @RequestMapping(value="/code", method = RequestMethod.GET)
    public ResponseEntity<List<Code>> listCode(){
    	return new ResponseEntity<List<Code>>(codeService.findAll(),HttpStatus.OK);
    }

    //@PreAuthorize("hasRole('ROLE_3')")
    @RequestMapping(value = "/code", method = RequestMethod.POST)
    public ResponseEntity<Code> create(@RequestBody Code code){
    	return new ResponseEntity<Code>(codeService.save(code), HttpStatus.OK);
    }
    
   /* @RequestMapping(value = "/code/{codeId}", method = RequestMethod.POST)
    public ResponseEntity<Code> createCodeValue(@PathVariable (value = "codeId") String codeId, @RequestBody CodeValue codeValue){
    	 Code code = codeService.findOne(codeId);
    	 CustomIdGeneration idGen = new CustomIdGeneration();
    	 if(code != null) {
    		 Set bookBs = new HashSet<Book>(){{
    	            add(new Book("Book B1", categoryB));
    	            add(new Book("Book B2", categoryB));
    	            add(new Book("Book B3", categoryB));
    	        }};
    		 Set codeValueList = new HashSet<CodeValue>();
    		 codeValue.setId(idGen.generateTxnId(new Date()));
    		 codeValueList.add(codeValue);
    		 code.setCodeValueList(codeValueList);
    	 }
    	 System.out.println(code);
      	return new ResponseEntity<Code>(codeService.save(code), HttpStatus.OK);
    }*/
    
    
    @RequestMapping(value = "/code/{id}", method = RequestMethod.GET)
    public ResponseEntity<Code> findOne(@PathVariable String id){
    	return new ResponseEntity<Code>(codeService.findOne(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/code/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Code> update(@PathVariable String id, @RequestBody Code code){
        code.setId(id);
        return new ResponseEntity<Code>(codeService.save(code), HttpStatus.OK);
    }

    @RequestMapping(value = "/code/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable(value = "id") String id){
    	codeService.delete(id);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
