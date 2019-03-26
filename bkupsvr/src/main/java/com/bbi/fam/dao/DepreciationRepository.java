package com.bbi.fam.dao;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bbi.fam.model.DepreciationPolicy;

@Repository
public interface DepreciationRepository extends CrudRepository<DepreciationPolicy, String>{
	
	DepreciationPolicy findByAssetTypeAndAssetSubType(String assetType, String assetSubType);
}
