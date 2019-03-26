package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.model.UserLimitMaster;
import com.bbi.fam.model.UserLimitTxn;

public interface UserLimitMasterService {
    UserLimitMaster save(UserLimitTxn userLimiTxn);
    List<UserLimitMaster> findAll();
}
