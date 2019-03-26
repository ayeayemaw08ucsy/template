package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.VendorTnx;

@Repository
public interface VendorTnxRepository extends CrudRepository<VendorTnx, Long> {
	
	VendorTnx findByVendorTnxSeqId(String vendorSeqId);
	VendorTnx deleteByVendorTnxSeqId(String vendorTnxSeqId);
	List<VendorTnx> findByTnxStatusCode(String tnxStatusCode);
	List<VendorTnx> findAll();
	
	//@Query("SELECT vtnx FROM VendorTnx vtnx WHERE vtnx.tnxStatusCode = :tnxStatusCode ")
	//List<VendorTnx> findByTnxStatusCode(@Param("tnxStatusCode") String tnxStatusCode);
}
