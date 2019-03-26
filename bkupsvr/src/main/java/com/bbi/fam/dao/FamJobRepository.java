package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Job;

@Repository
public interface FamJobRepository extends JpaRepository<Job, String> {
	 Job findByJobName(String jobName);
	 
	 @Query("select j from Job j order by j.jobStarttime desc")
	 List<Job> findAll();
}
