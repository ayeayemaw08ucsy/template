package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.exception.FamSystemException;
import com.bbi.fam.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username) throws FamSystemException;
    List<User> findByUsernameNot(String userName) throws FamSystemException;
    User findByUsernameAndEntity(String username, String entity) throws FamSystemException;
}
