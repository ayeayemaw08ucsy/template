package com.bbi.fam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.model.WeeklyPolicy;
import com.bbi.fam.service.WeeklyPolicyService;

@RestController
@RequestMapping("/weekly-policys")
public class WeeklyPolicyController {

    @Autowired
    private WeeklyPolicyService weeklyPolicyService;

    @RequestMapping(value = "/weekly-policy", method = RequestMethod.GET)
    public ResponseEntity<WeeklyPolicy> findOne(){
    	return new ResponseEntity<WeeklyPolicy>(weeklyPolicyService.findOne(), HttpStatus.OK);
    }

    @RequestMapping(value = "/weekly-policy", method = RequestMethod.PUT)
    public ResponseEntity<WeeklyPolicy> update(@RequestBody WeeklyPolicy weeklyPolicy){
        return new ResponseEntity<WeeklyPolicy>(weeklyPolicyService.save(weeklyPolicy), HttpStatus.OK);
    }

}
