package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.ResetPasswordRepository;
import com.bbi.fam.dao.UserRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.ResetPassword;
import com.bbi.fam.model.User;
import com.bbi.fam.service.ResetPasswordService;
import com.bbi.fam.service.UserService;

@Service(value = "resetPasswordService")
public class ResetPasswordServiceImpl implements ResetPasswordService {

	@Autowired
	private ResetPasswordRepository resetPasswordRepository;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public List<ResetPassword> findAll() {
		List<ResetPassword> list = new ArrayList<>();
		resetPasswordRepository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public ResetPassword save(ResetPassword request) throws FamApplicationException {
		User user = userRepository.findByUsernameAndEntity(request.getUsername(), request.getEntity());
		ResetPassword password = new ResetPassword();
		if (user != null) {
			request.setDescription("Password Reset Request by " + request.getUsername());
			password = resetPasswordRepository.save(request);
		} else {
			throw new FamApplicationException("Cannot find the user");
		}
		return password;
	}

	@Override
	@Transactional("transactionManager")
	public void update(String username, String password) {
		password = password.replaceAll("\\s+","");
		User user = userRepository.findByUsername(username);
		user.setPassword(bCryptPasswordEncoder.encode(password));
		Calendar cal = Calendar.getInstance(); 
		cal.add(Calendar.MONTH, 6);
		user.setPwdExpiryDate(cal.getTime());
		resetPasswordRepository.deleteByUsername(username);
		userRepository.save(user);
	}

}
