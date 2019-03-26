package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.ProductRepository;
import com.bbi.fam.model.Product;
import com.bbi.fam.service.ProductService;
import com.bbi.fam.utils.CustomIdGeneration;

@Service(value = "productService")
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepo;
	
	public List<Product> findAll() {
		List<Product> list = new ArrayList<>();
		productRepo.findAll().iterator().forEachRemaining(list::add);
		return list; 
	}

	@Override
	public Product findOne(String id) {
		return productRepo.findById(id).get();
	}

	@Override
	public void delete(String id) {
		productRepo.deleteById(id);
	}

	@Override
	public Product save(Product product) {
		//have to set dynamic branchcode and assettypecode
		//product.setPrefix(CustomIdGeneration.generateProductId("BBB", new Date(), "AST"));
		return productRepo.save(product);
	}
}
