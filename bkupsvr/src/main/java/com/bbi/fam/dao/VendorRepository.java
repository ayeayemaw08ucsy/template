package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.exception.FamSystemException;
import com.bbi.fam.model.Vendor;

@Repository
public interface VendorRepository extends CrudRepository<Vendor, String> {
	
	Vendor findByVendorCode(String vdrCode) throws FamSystemException;

	Vendor findByVendorSeqId(String vendorSeqId);
	
	@Modifying
	@Query("Delete From Vendor vdr Where vdr.vendorSeqId = :vendorSeqId ")
	void deleteByVendorSeqId(@Param("vendorSeqId") String vendorSeqId);
	
	@Query("SELECT vdr FROM Vendor vdr WHERE vdr.activeStatus = 'Y' ")
	List<Vendor> getAllVendors();
}
