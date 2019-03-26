package com.bbi.fam.dao;

import org.springframework.data.repository.CrudRepository;

import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.PictureAndQRInfo;

public interface PictureAndQRInfoRepository extends CrudRepository<PictureAndQRInfo, String> {
	
	PictureAndQRInfo findByProdRefId(String prodRefId);

}
