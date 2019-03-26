package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Holiday;
import com.bbi.fam.model.Notifications;
import com.bbi.fam.model.ResetPassword;
import com.bbi.fam.model.User;
import com.bbi.fam.service.ResetPasswordService;
import com.bbi.fam.service.impl.UserServiceImpl;

@RestController
@RequestMapping("/oauth")
public class ResetPasswordController {

	@Autowired
	private ResetPasswordService resetPasswordService;

	@Autowired
	private SimpMessagingTemplate template;

	@Autowired
	private UserServiceImpl userService;

	// @PreAuthorize("hasRole('ROLE_1')")
	@RequestMapping(value = "/resetPassword", method = RequestMethod.GET)
	public ResponseEntity<List<ResetPassword>> listResetPassword() {
		return new ResponseEntity<List<ResetPassword>>(resetPasswordService.findAll(), HttpStatus.OK);
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
	public ResponseEntity<Object> create(@RequestBody ResetPassword resetPassword) {
		try {
			Object obj = resetPasswordService.save(resetPassword);
			List<User> userList = userService.findAll();
			Notifications n = new Notifications();
			n.setMessage("New Password Request!!!");
			for (User user : userList) {
				template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
			}
			return new ResponseEntity<Object>(obj, HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}

	}

	@RequestMapping(value = "/password/{username}/{password}", method = RequestMethod.PUT)
	public ResponseEntity<Object> update(@PathVariable String username, @PathVariable String password) {
		resetPasswordService.update(username, password);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}

}
