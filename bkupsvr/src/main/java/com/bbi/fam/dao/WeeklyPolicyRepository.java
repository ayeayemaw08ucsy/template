package com.bbi.fam.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.WeeklyPolicy;

@Repository
public interface WeeklyPolicyRepository extends CrudRepository<WeeklyPolicy, String> {
}
