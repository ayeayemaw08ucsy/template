package com.bbi.fam.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAssetAdditionalInfo;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;

public interface FixedAssetAdditionalInfoService {
  
	FixedAssetAdditionalInfo findByProdRefId(String prodRefId);
	List<FixedAssetAdditionalInfoTnx>	findByProdRefIdAndFixedAssetTnxSeqId(String prodRefId,String fixedAssetTnxSeqId)throws FamApplicationException;
}
