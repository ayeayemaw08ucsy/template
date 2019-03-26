package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.User;

public interface UserService {

    User save(User user) throws FamApplicationException;
    List<User> findAll();
    User findOne(long id);
    void delete(long id);
    User storeEmployee(User user);
    List<User> findByUsernameNot(String userName);
    public User findByUsername(String userId);
}
