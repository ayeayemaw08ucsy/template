package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.UserFunctionRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.User;
import com.bbi.fam.model.UserFunction;
import com.bbi.fam.service.UserService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private UserFunctionRepository userFunctionRepo;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private KieContainer kieContainer;
	
	@Value("${spring.error.duplicateerror.username}")
	private String username;

	public User loadUserByUsername(String userId) throws UsernameNotFoundException {
		String[] stringArray = userId.split(",,,");
		User user = userRepo.findByUsernameAndEntity(stringArray[0], stringArray[1]);
		if (user == null) {
			throw new BadCredentialsException("Invalid username");
		}

		return new User(user.getId(), user.getFirstName(), user.getLastName(), user.getUsername(), user.getPassword(),
				user.getEntity(), user.getEmail(), user.getPhone(), user.getGender(), user.getBranchCode(),
				user.getDeptCode(), user.getLevelCode(), user.getUserRole(), user.getPwdExpiryDate(), user.getBusinessDate(),
				user.isEnabled(), user.isAccountNonExpired(), user.isAccountNonLocked(), user.isCredentialsNonExpired(),
				userFunctionRepo.findByUsername(user.getUsername()));
	}
	
	@Override
	public User findByUsername(String userId){
		String[] stringArray = userId.split(",,,");
		User user = userRepo.findByUsernameAndEntity(stringArray[0], stringArray[1]);
		user.setValueList(userFunctionRepo.findByUsername(user.getUsername()));
		return user;
	}

	public List<User> findAll() {
		List<User> list = new ArrayList<>();
		List<User> userList = new ArrayList<>();
		userRepo.findAll().iterator().forEachRemaining(list::add);
		for (User user : list) {
			user.setValueList(userFunctionRepo.findByUsername(user.getUsername()));
			userList.add(user);
		}
		return userList;
	}

	@Override
	public User findOne(long id) {
		User user = userRepo.findById(id).get();
		if(user != null) {
			user.setValueList(userFunctionRepo.findByUsername(user.getUsername()));
		}
		return user;
	}

	@Override
	public void delete(long id) {
		userRepo.deleteById(id);
	}

	@Override
	@Transactional("transactionManager")
	public User save(User user) throws FamApplicationException {
		if (user.getCodeValueList().getCodeValueList() == null || user.getCodeValueList().getCodeValueList().size() == 0) {
			throw new FamApplicationException("Please choose at least one function !!!");
		}
		User tempUser = userRepo.findByUsername(user.getUsername());
		if (user.getId() <= 0) {
			user.setAccountNonExpired(true);
			user.setAccountNonLocked(true);
			user.setEnabled(true);
			user.setCredentialsNonExpired(true);
			user.setEntity("EN1");
			Calendar cal = Calendar.getInstance(); 
			cal.add(Calendar.MONTH, 6);
			user.setPwdExpiryDate(cal.getTime());
			if(tempUser != null) {
				throw new FamApplicationException(username + " "+ user.getUsername());
			}
		}
		userFunctionRepo.deleteByUsername(user.getUsername());
		List<UserFunction> functionList = new ArrayList<>();
		for (String s : user.getCodeValueList().getCodeValueList()) {
			UserFunction u = new UserFunction();
			u.setBusinessDate(new Date());
			u.setCode(s);
			u.setEntity("EN1");
			u.setUsername(user.getUsername());
			u.setId(CustomIdGeneration.generateTxnId(new Date()));
			functionList.add(u);
			userFunctionRepo.save(u);
		}
		user.setValueList(functionList);
		if(tempUser != null) {
			if(!user.getPassword().equalsIgnoreCase(tempUser.getPassword())) {
				user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
				Calendar cal = Calendar.getInstance(); 
				cal.add(Calendar.MONTH, 6);
				user.setPwdExpiryDate(cal.getTime());
			}
		} else {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
			Calendar cal = Calendar.getInstance(); 
			cal.add(Calendar.MONTH, 6);
			user.setPwdExpiryDate(cal.getTime());
		}
		user = userRepo.save(user);
		user.setValueList(userFunctionRepo.findByUsername(user.getUsername()));
		return user;
	}

	@Override
	public User storeEmployee(User user) {
		KieSession kieSession = kieContainer.newKieSession();
		kieSession.insert(user); // which object to validate
		kieSession.fireAllRules(); // fire all rules defined into drool file (drl)
		System.out.println("Fire all Rules");
		kieSession.dispose();

		// save employee object to database
		return userRepo.save(user);
	}

	/**
	 * Get All User List Not By current login User.
	 */
	@Override
	public List<User> findByUsernameNot(String userName) {
		return userRepo.findByUsernameNot(userName);
	}

}
