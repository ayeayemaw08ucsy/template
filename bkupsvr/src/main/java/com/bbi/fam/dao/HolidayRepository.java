package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Holiday;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
	
	@Query("Select h from Holiday h where h.year = ?1 order by h.date asc")
	List<Holiday> findByYear(String year);
	
	@Query("Select h from Holiday h order by h.date asc")
	List<Holiday> findAllSorted();
	
	List<Holiday> findByDate(String date);
}
