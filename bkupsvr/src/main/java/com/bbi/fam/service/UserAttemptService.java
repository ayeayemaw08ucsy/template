package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.model.UserAttempt;

public interface UserAttemptService {

    UserAttempt save(UserAttempt userAttempt);
    List<UserAttempt> findAll();
    UserAttempt findOne(long id);
    void delete(long id);
    UserAttempt findByUsername(String username);
}
