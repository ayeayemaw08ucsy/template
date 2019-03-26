package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Holiday;
import com.bbi.fam.model.User;

public interface HolidayService {

    Holiday save(Holiday holiday) throws FamApplicationException;
    List<Holiday> findAll();
    Holiday findOne(long id);
    void delete(long id);
    List<String> findByYear();
}
