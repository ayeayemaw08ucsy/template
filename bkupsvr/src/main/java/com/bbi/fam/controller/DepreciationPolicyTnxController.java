package com.bbi.fam.controller;

import java.util.Date;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.exception.FamSystemException;
import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.DepreciationPolicy;
import com.bbi.fam.model.DepreciationPolicyTnx;
import com.bbi.fam.model.Notifications;
import com.bbi.fam.model.User;
import com.bbi.fam.service.DepreciationPolicyService;
import com.bbi.fam.service.DepreciationPolicyTnxService;
import com.bbi.fam.service.impl.UserServiceImpl;
import com.bbi.fam.utils.Common;
import com.bbi.fam.utils.CustomIdGeneration;

@RestController
@RequestMapping("/deppolicytnx")
public class DepreciationPolicyTnxController {

	@Autowired
	private DepreciationPolicyTnxService depPolicytnxService;

	@Autowired
	private AccountHelperImpl accountHelperImpl;
	
	@Value("${spring.notification.message.deppolicy}")
	private String notiMessage;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@Autowired
	private UserServiceImpl userService;

	/**
	 * 
	 * @param codeValue
	 * @return
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResponseEntity<Object> createDepPolicyTnx(@RequestBody DepreciationPolicyTnx depPolicyTnx) {
		
			try {
				
				List<User> userList = userService.findByUsernameNot(accountHelperImpl.getLoginUser().getUsername());
				Notifications n = new Notifications();
				n.setMessage(notiMessage);
				for (User user : userList) {
					template.convertAndSendToUser(user.getUsername(), "/queue/notification/", n);
				}
				
				return new ResponseEntity<Object>(depPolicytnxService.save(depPolicyTnx), HttpStatus.OK);
		
			} catch (FamApplicationException ex) {
				
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
		}

	 @RequestMapping(value="/get-tasks", method = RequestMethod.GET)
	    public ResponseEntity<List<DepreciationPolicyTnx>> getTasks(){
	    	return new ResponseEntity<List<DepreciationPolicyTnx>>(depPolicytnxService.getTasks(accountHelperImpl.getLoginUser().getUsername()), HttpStatus.OK);
	    }
	  
	 @RequestMapping(value = "/approve", method = RequestMethod.POST)
	  public ResponseEntity<Object> approve(@RequestBody DepreciationPolicyTnx depPolicyTnx){
		  try {
				 
				return new ResponseEntity<Object>(depPolicytnxService.save(depPolicyTnx), HttpStatus.OK);
				
			} catch (FamApplicationException ex) {
				
				String error = ex.getMessage();
				ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error , ex.getLocalizedMessage());
				return new ResponseEntity<Object>(apiError, apiError.getStatus());
			}
	    }

	/**
	 * 
	 * @return
	 */
	@RequestMapping(value = "/policies", method = RequestMethod.GET)
	public ResponseEntity<List<DepreciationPolicyTnx>> listDepPolicyTnx() {
		return new ResponseEntity<List<DepreciationPolicyTnx>>(depPolicytnxService.findAll(), HttpStatus.OK);
	}

	/**
	 * 
	 * @param codeValueId
	 * @param codeValue
	 * @return
	 */
	@RequestMapping(value = "/policies", method = RequestMethod.PUT)
	public ResponseEntity<DepreciationPolicyTnx> update(@RequestBody DepreciationPolicyTnx depPolicyTnx) {
		depPolicyTnx.setDepPloicyTnxSeqId(CustomIdGeneration.generateTxnId(new Date()));
		depPolicyTnx.setBusiness_date(new Date());
		depPolicyTnx.setInputUserId(accountHelperImpl.getLoginUser().getUsername());
		depPolicyTnx.setInputDateTime(new Date());
		try {
			return new ResponseEntity<DepreciationPolicyTnx>(depPolicytnxService.save(depPolicyTnx), HttpStatus.OK);
		} catch (FamApplicationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/policies/{deptnxSeqId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable(value = "deptnxSeqId") String id) {
		depPolicytnxService.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	/**
	 * 
	 * @return
	 */
	@RequestMapping(value = "/status/{tnxStatus}", method = RequestMethod.GET)
	public ResponseEntity<List<DepreciationPolicyTnx>> getAllTnxStatusComplete(
			@PathVariable(value = "tnxStatus") String tnxStatus) {
		return new ResponseEntity<List<DepreciationPolicyTnx>>(depPolicytnxService.findBytnxStatusCode(tnxStatus),
				HttpStatus.OK);
	}
   
	/*
	 * @RequestMapping(value="/values/{depPolicySeqId}", method = RequestMethod.GET)
	 * public ResponseEntity<List<DepreciationPolicyTnx>>
	 * getDepPolicyTnxListByDepPolicySeqId(@PathVariable (value="depPolicySeqId")
	 * String depPolicySeqId) { return new
	 * ResponseEntity<List<DepreciationPolicyTnx>>(tnxService.
	 * findByDepreciationPolicySeqId(depPolicySeqId),HttpStatus.OK);
	 * 
	 * }
	 */
}
