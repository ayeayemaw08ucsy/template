package com.bbi.fam.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.Product;

@Repository
public interface ProductRepository extends CrudRepository<Product, String> {

	@Query(value = "UPDATE PRODUCT_SEQ SET NEXT_VAL = 1", nativeQuery = true)
	void resetSequence(); 
}
