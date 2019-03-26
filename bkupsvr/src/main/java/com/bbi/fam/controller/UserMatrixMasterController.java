package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.Notifications;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixTxn;
import com.bbi.fam.service.UserMatrixMasterService;
import com.bbi.fam.service.UserMatrixTxnService;
import com.bbi.fam.service.impl.UserServiceImpl;

@RestController
@RequestMapping("/userMatrixTxn-matrix-txn")
public class UserMatrixMasterController {

	@Autowired
	private UserMatrixTxnService userMatrixTxnService;

	@Autowired
	private UserMatrixMasterService userMatrixMasterService;

	@Autowired
	private SimpMessagingTemplate template;

	@Autowired
	private AccountHelperImpl accoutnHelper;

	@Autowired
	private UserServiceImpl userService;
	
	@Value("${spring.notification.message.usermatrix}")
	private String usermatrix;

	// @PreAuthorize("hasRole('ROLE_1')")
	@RequestMapping(value = "/userMatrixMaster", method = RequestMethod.GET)
	public ResponseEntity<List<UserMatrixMaster>> listUserMatrixMaster() {
		return new ResponseEntity<List<UserMatrixMaster>>(userMatrixMasterService.findAll(), HttpStatus.OK);
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/userMatrixTxn", method = RequestMethod.POST)
	public ResponseEntity<Object> create(@RequestBody UserMatrixTxn userMatrixTxn) {
		try {
			List<User> userList = userService.findByUsernameNot(accoutnHelper.getLoginUser().getUsername());
			Notifications n = new Notifications();
			n.setMessage(usermatrix);
			for (User user : userList) {
				template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
			}
			return new ResponseEntity<Object>(userMatrixTxnService.save(userMatrixTxn), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}

	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/userMatrixTxn/{id}", method = RequestMethod.GET)
	public ResponseEntity<UserMatrixTxn> findOne(@PathVariable String id) {
		return new ResponseEntity<UserMatrixTxn>(userMatrixTxnService.findOne(id), HttpStatus.OK);
	}

	@RequestMapping(value = "/userMatrixTxn/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Object> update(@PathVariable long id, @RequestBody UserMatrixTxn userMatrixTxn) {
		try {
			return new ResponseEntity<Object>(userMatrixTxnService.save(userMatrixTxn), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}

	@RequestMapping(value = "/userMatrixTxn/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable(value = "id") String id) {
		userMatrixTxnService.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/get-tasks", method = RequestMethod.GET)
	public ResponseEntity<List<UserMatrixTxn>> getTasks() {
		return new ResponseEntity<List<UserMatrixTxn>>(userMatrixTxnService.getTasks(accoutnHelper.getLoginUser().getUsername()), HttpStatus.OK);
	}

	@RequestMapping(value = "/approve", method = RequestMethod.POST)
	public ResponseEntity<UserMatrixMaster> approve(@RequestBody UserMatrixTxn userMatrixTxn) {
		return new ResponseEntity<UserMatrixMaster>(userMatrixMasterService.save(userMatrixTxn), HttpStatus.OK);
	}

}
