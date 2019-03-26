package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Code;

@Repository
public interface CodeRepository extends CrudRepository<Code, String> {
	
	@Query("Select c from Code c order by c.codeIdDesc asc")
	List<Code> findAllSorted();

}

