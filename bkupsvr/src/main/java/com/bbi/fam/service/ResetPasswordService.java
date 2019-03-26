package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.ResetPassword;

public interface ResetPasswordService {
	public ResetPassword save(ResetPassword request) throws FamApplicationException;
	public List<ResetPassword> findAll();
	public void update(String username, String password);
}
