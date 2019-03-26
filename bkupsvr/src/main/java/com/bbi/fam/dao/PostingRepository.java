package com.bbi.fam.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.PostingTxn;

@Repository
public interface PostingRepository extends JpaRepository<PostingTxn, Long> {
	
}
