package com.bbi.fam.config;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.provider.endpoint.FrameworkEndpoint;
import org.springframework.security.oauth2.provider.token.ConsumerTokenServices;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bbi.fam.dao.UserActivityRepository;
import com.bbi.fam.model.UserActivity;

@FrameworkEndpoint
public class RevokeTokenEndpoint {

	@Autowired
	ConsumerTokenServices tokenServices;
	
	@Autowired
	UserActivityRepository activityRepo;

	@RequestMapping(method = RequestMethod.POST, value = "/oauth/token/revoke")
	public @ResponseBody void revokeToken(HttpServletRequest request) {
		String authorization = request.getHeader("auth_token");
		String username = request.getHeader("username");
		tokenServices.revokeToken(authorization);
		activityRepo.save(new UserActivity(username, "LOG OUT", new Date()));
		System.out.println("Removing token done" + authorization);
	}
}