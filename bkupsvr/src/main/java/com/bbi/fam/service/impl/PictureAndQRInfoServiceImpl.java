package com.bbi.fam.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.PictureAndQRInfoRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.PictureAndQRInfo;
import com.bbi.fam.model.PictureAndQRInfoTnx;
import com.bbi.fam.service.PictureAndQRInfoService;

@Service(value="pictureAndQRInfoService")
public class PictureAndQRInfoServiceImpl implements PictureAndQRInfoService {

	@Autowired
	public PictureAndQRInfoRepository pcQRInfoRepo;
	
	@Override
	public PictureAndQRInfo findByprodRefId(String prodRefId) throws FamApplicationException {
		// TODO Auto-generated method stub
		return pcQRInfoRepo.findByProdRefId(prodRefId);
	}

	@Override
	public List<PictureAndQRInfoTnx> findByProdRefIdAndFixedAssetTnxSeqId(String prodRefId, String fixedAssetTnxSeqId)
			throws FamApplicationException {
		// TODO Auto-generated method stub
		return null;
	}

}
