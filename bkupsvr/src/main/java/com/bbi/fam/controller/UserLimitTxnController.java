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
import com.bbi.fam.model.UserLimitMaster;
import com.bbi.fam.model.UserLimitTxn;
import com.bbi.fam.service.UserLimitMasterService;
import com.bbi.fam.service.UserLimitTxnService;
import com.bbi.fam.service.impl.UserServiceImpl;

@RestController
@RequestMapping("/userLimitTxn-limit-txn")
public class UserLimitTxnController {

	@Autowired
    private UserLimitTxnService userLimitTxnService;
	
	@Autowired
    private UserLimitMasterService userLimitMasterService;
	
	@Autowired
	private SimpMessagingTemplate template;

	@Autowired
	private AccountHelperImpl accoutnHelper;

	@Autowired
	private UserServiceImpl userService;
	
	@Value("${spring.notification.message.userlimit}")
	private String userlimit;
    
    //@PreAuthorize("hasRole('ROLE_1')")
    @RequestMapping(value="/userLimitMaster", method = RequestMethod.GET)
    public ResponseEntity<List<UserLimitMaster>> listUserLimitMaster	(){
    	return new ResponseEntity<List<UserLimitMaster>>(userLimitMasterService.findAll(), HttpStatus.OK);
    }

    //@PreAuthorize("hasRole('ROLE_3')")
    @RequestMapping(value = "/userLimitTxn", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody UserLimitTxn userLimitTxn){
    	try {
    		List<User> userList = userService.findByUsernameNot(accoutnHelper.getLoginUser().getUsername());
			Notifications n = new Notifications();
			n.setMessage(userlimit);
			for (User user : userList) {
				template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
			}
    		return new ResponseEntity<Object>(userLimitTxnService.save(userLimitTxn), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    	
    }
    //@PreAuthorize("hasRole('ROLE_3')")
    @RequestMapping(value = "/userLimitTxn/{id}", method = RequestMethod.GET)
    public ResponseEntity<UserLimitTxn> findOne(@PathVariable String id){
    	return new ResponseEntity<UserLimitTxn>(userLimitTxnService.findOne(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/userLimitTxn/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@PathVariable long id, @RequestBody UserLimitTxn userLimitTxn){
    	try {
    		List<User> userList = userService.findByUsernameNot(accoutnHelper.getLoginUser().getUsername());
			Notifications n = new Notifications();
			n.setMessage(userlimit);
			for (User user : userList) {
				template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
			}
    		return new ResponseEntity<Object>(userLimitTxnService.save(userLimitTxn), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
    }

    @RequestMapping(value = "/userLimitTxn/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable(value = "id") String id){
    	userLimitTxnService.delete(id);
    	return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @RequestMapping(value="/get-tasks", method = RequestMethod.GET)
    public ResponseEntity<List<UserLimitTxn>> getTasks(){
    	return new ResponseEntity<List<UserLimitTxn>>(userLimitTxnService.getTasks(accoutnHelper.getLoginUser().getUsername()), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/approve", method = RequestMethod.POST)
    public ResponseEntity<UserLimitMaster> approve(@RequestBody UserLimitTxn userLimitTxn){
    	return new ResponseEntity<UserLimitMaster>(userLimitMasterService.save(userLimitTxn), HttpStatus.OK);
    }
    
}
