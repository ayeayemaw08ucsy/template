package com.bbi.fam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.User;
import com.bbi.fam.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	// @PreAuthorize("hasRole('ROLE_1')")
	@RequestMapping(value = "/user", method = RequestMethod.GET)
	public ResponseEntity<List<User>> listUser() {
		return new ResponseEntity<List<User>>(userService.findAll(), HttpStatus.OK);
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/user", method = RequestMethod.POST)
	public ResponseEntity<Object> create(@RequestBody User user) {
		try {
			return new ResponseEntity<Object>(userService.save(user), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
		
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public ResponseEntity<User> findOne(@PathVariable long id) {
		return new ResponseEntity<User>(userService.findOne(id), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/user/user/{username}", method = RequestMethod.GET)
	public ResponseEntity<User> findByUsername(@PathVariable String username) {
		return new ResponseEntity<User>(userService.findByUsername(username), HttpStatus.OK);
	}

	/*@RequestMapping(value = "/user/update", method = RequestMethod.PUT)
	public ResponseEntity<User> update(@RequestBody User user) {
		return new ResponseEntity<User>(userService.save(user), HttpStatus.OK);
	}*/

	@RequestMapping(value = "/user/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable(value = "id") Long id) {
		userService.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/user/save", method = RequestMethod.POST)
	public ResponseEntity<User> save(@RequestBody User user) {
		return new ResponseEntity<User>(userService.storeEmployee(user), HttpStatus.OK);
	}

}
