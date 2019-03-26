package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.UserMatrixTxn;

public interface UserMatrixTxnService {
	UserMatrixTxn save(UserMatrixTxn userMatrixTxn) throws FamApplicationException;
    List<UserMatrixTxn> findAll();
    UserMatrixTxn findOne(String id);
    void delete(String id);
    public List<UserMatrixTxn> getTasks(String assignee);
}
