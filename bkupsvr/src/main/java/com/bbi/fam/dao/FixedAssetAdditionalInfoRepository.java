package com.bbi.fam.dao;

import org.springframework.data.repository.CrudRepository;

import com.bbi.fam.model.FixedAssetAdditionalInfo;

public interface FixedAssetAdditionalInfoRepository  extends CrudRepository<FixedAssetAdditionalInfo, String>  {
	
	FixedAssetAdditionalInfo findByProdRefId(String prodRefId) ;
	//FixedAssetAdditionalInfo findByProdRefId(String prodRefId);
}
