package com.bbi.fam.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.util.MultiValueMap;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Vendor;
import com.bbi.fam.model.VendorTnx;

public interface VendorService {

    Vendor save(Vendor vendor);
    List<Vendor> findAll();
    Vendor findOne(String id);
    Vendor delete(String id) throws FamApplicationException, Exception;
    Vendor register(Vendor vendor)throws FamApplicationException, SQLException ;
    Vendor update(Vendor vendor)throws FamApplicationException, SQLException ;
    List<Vendor> getAllVendors();
    Vendor approve(VendorTnx vendorTnx)throws FamApplicationException, SQLException ;
	Vendor requestForUpdate(Vendor vendor)throws FamApplicationException, SQLException ;
	Vendor updateApprove(VendorTnx vendorTnx)throws FamApplicationException, SQLException ;
}
