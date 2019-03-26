package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.UserMatrixMaster;
import com.bbi.fam.model.UserMatrixTxn;

public interface UserMatrixMasterService {
    UserMatrixMaster save(UserMatrixTxn txn);
    List<UserMatrixMaster> findAll();
}
