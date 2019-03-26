package com.bbi.fam.config;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserActivity;
import com.bbi.fam.model.UserAttempt;
import com.bbi.fam.service.UserAttemptService;

@Component("authenticationProvider")
public class LimitLoginAuthenticationProvider extends DaoAuthenticationProvider {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserAttemptService userAttemptService;
	
	@Value("${login.attempt}")
	private int attempt;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	@Override
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		super.setUserDetailsService(userDetailsService);
	}

	@Autowired
	@Override
	public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
		super.setPasswordEncoder(passwordEncoder);
	}

	@Override
	@Transactional("jpaTrx")
	public Authentication authenticate(Authentication authentication) {
		//Session session = (Session) entityManager.unwrap(Session.class);
		try {
			Authentication auth = super.authenticate(authentication);
			UserAttempt userAttempt = new UserAttempt();
			String[] stringArray = authentication.getName().split(",,,");
			userAttempt = userAttemptService.findByUsername(stringArray[0]);
			entityManager.persist(new UserActivity(authentication.getName(), "LOG IN", new Date()));
			if (userAttempt != null) {
				entityManager
						.remove(entityManager.contains(userAttempt) ? userAttempt : entityManager.merge(userAttempt));
			}
			return auth;
		} catch (BadCredentialsException e) {
			
			throw new BadCredentialsException("Wrong Password");

		} catch (LockedException e) {

			throw new LockedException("Accound is Locked");
		}

	}

}
