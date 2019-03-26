package com.bbi.fam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.model.Product;
import com.bbi.fam.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @RequestMapping(value = "/product", method = RequestMethod.POST)
    public ResponseEntity<Product> create(@RequestBody Product product){
    	return new ResponseEntity<Product>(productService.save(product), HttpStatus.OK);
    }

}
