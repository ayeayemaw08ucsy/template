package com.bbi.fam.service;

import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.PictureAndQRInfo;
import com.bbi.fam.model.PictureAndQRInfoTnx;

public interface PictureAndQRInfoService {

	 PictureAndQRInfo findByprodRefId(String prodRefId) throws FamApplicationException;
	 List<PictureAndQRInfoTnx> findByProdRefIdAndFixedAssetTnxSeqId(String prodRefId,String fixedAssetTnxSeqId) throws FamApplicationException;
}
