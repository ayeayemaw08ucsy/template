package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.VendorTnx;

public interface VendorTnxService {
	
	VendorTnx save(VendorTnx vendorTnx);
    List<VendorTnx> findAll();
    VendorTnx findOne(String vendorTnxSeqId);
    List<VendorTnx> findByTnxStatusCode(String tnxStatusCode);
    VendorTnx delete(String id) throws FamApplicationException, Exception;
    VendorTnx update(VendorTnx vendorTnx)throws FamApplicationException;
    List<VendorTnx> getAllVendorTnx();

}
