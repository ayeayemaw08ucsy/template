package com.bbi.fam.dao;

import org.springframework.data.repository.CrudRepository;

import com.bbi.fam.model.FixedAssetTnx;
import com.bbi.fam.model.PictureAndQRInfoTnx;

public interface PictureAndQRInfoTnxRepository  extends CrudRepository<PictureAndQRInfoTnx, String>  {
	
	PictureAndQRInfoTnx findByProdRefId(String prodRefId);
	
	PictureAndQRInfoTnx findByFixedAssetTnx(FixedAssetTnx tnx);
	
	void deleteByFixedAssetTnx(FixedAssetTnx fixedAssetTnx);

}
