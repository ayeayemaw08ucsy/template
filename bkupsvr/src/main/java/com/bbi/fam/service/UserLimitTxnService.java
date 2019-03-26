package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.UserLimitTxn;

public interface UserLimitTxnService {
	UserLimitTxn save(UserLimitTxn userLimitTxn) throws FamApplicationException;
    List<UserLimitTxn> findAll();
    UserLimitTxn findOne(String id);
    void delete(String id);
    public List<UserLimitTxn> getTasks(String assignee);
}
