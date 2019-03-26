package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.model.UserActivity;
import com.bbi.fam.service.UserActivityService;

@RestController
@RequestMapping("/user-activity")
public class UserActivityController {

	@Autowired
	private UserActivityService userActivityService;

	// @PreAuthorize("hasRole('ROLE_1')")
	@RequestMapping(value = "/userActivity", method = RequestMethod.GET)
	public ResponseEntity<List<UserActivity>> listUserActivity() {
		return new ResponseEntity<List<UserActivity>>(userActivityService.findAll(), HttpStatus.OK);
	}

}
