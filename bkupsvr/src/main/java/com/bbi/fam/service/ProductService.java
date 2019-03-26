package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.model.Product;

public interface ProductService {

    Product save(Product Product);
    List<Product> findAll();
    Product findOne(String id);
    void delete(String id);
}
