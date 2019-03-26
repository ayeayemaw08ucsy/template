package com.bbi.fam.config;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserActivity;
import com.bbi.fam.model.UserAttempt;
import com.bbi.fam.service.UserAttemptService;

@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
	@Autowired
    private UserRepository userRepo;

    @Autowired
    private UserAttemptService userAttemptService;

    @Value("${login.attempt}")
    private int attempt;

    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    @Transactional("jpaTrx")
    public void onApplicationEvent(final AuthenticationFailureBadCredentialsEvent e) {
    	String[] stringArray = e.getAuthentication().getName().split(",,,");
		UserAttempt userAttempt = userAttemptService.findByUsername(stringArray[0]);
		User user = userRepo.findByUsername(stringArray[0]);
		entityManager.persist(new UserActivity(e.getAuthentication().getName(), "Password Mismatch", new Date()));
		user.setLastLoginFail(new Date());
		entityManager.merge(user);
		if (userAttempt == null) {
			userAttempt = new UserAttempt();
			userAttempt.setAttempt(1);
			userAttempt.setUsername(user.getUsername());
			entityManager.persist(userAttempt);
		} else {
			userAttempt.setAttempt(userAttempt.getAttempt() + 1);
			entityManager.merge(userAttempt);
			if (userAttempt.getAttempt() >= attempt) {
				user.setAccountNonLocked(false);
				entityManager.merge(user);
			}
		}
    }
}
