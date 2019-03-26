package com.bbi.fam.service;

import java.util.List;
import java.util.Set;

import com.bbi.fam.model.Code;
import com.bbi.fam.model.CodeValue;

public interface CodeService {

    Code save(Code code);
    List<Code> findAll();
    Code findOne(String id);
    void delete(String id);
    
}
