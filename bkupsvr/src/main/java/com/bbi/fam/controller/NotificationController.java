package com.bbi.fam.controller;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.helper.AccountHelperImpl;
import com.bbi.fam.model.DepreciationPolicyTnx;
import com.bbi.fam.model.Notifications;
import com.bbi.fam.model.User;
import com.bbi.fam.service.impl.DepreciationPolicyTnxServiceImpl;
import com.bbi.fam.service.impl.UserServiceImpl;
import com.bbi.fam.utils.Common;

@RestController
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private AccountHelperImpl accountHelperImpl;
    
    @Autowired
    private UserServiceImpl userService;
    
    @Autowired
    private DepreciationPolicyTnxServiceImpl depPolicyTnxService;
    
    //@GetMapping("/notify")
    public String getNotification() {

        template.convertAndSendToUser("admin" , "/queue/notification/", null);

        return "Notifications successfully sent to Angular !";
        
    }
    
    	@MessageMapping("/notify")
    	@SendTo("/deppolicy/aprroval")
      public  String  sendApprovalReqForDepPolicy() {
	  	
	  	String userName = accountHelperImpl.getLoginUser().getUsername();
	  	List<User> userList = userService.findByUsernameNot(userName);
	  	List<DepreciationPolicyTnx> depPolicyTnxLst = depPolicyTnxService.findBytnxStatusCode(Common.TNX_STATUS_CODE[1]);
	  	
	 	for(User user: userList) {
	  		
	          template.convertAndSendToUser(user.getUsername(), "/queue/notification/",new JSONObject(depPolicyTnxLst));
	  	}
	  	return "Successfully sent request to all user";
	  }
}
