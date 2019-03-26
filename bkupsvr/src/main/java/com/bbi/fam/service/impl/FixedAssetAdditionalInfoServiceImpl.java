package com.bbi.fam.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bbi.fam.dao.FixedAssetAdditionalInfoRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAssetAdditionalInfo;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.service.FixedAssetAdditionalInfoService;

@Service(value = "fixedAssetAdditionalInfoservice")
public class FixedAssetAdditionalInfoServiceImpl implements FixedAssetAdditionalInfoService {

	@Autowired
	public FixedAssetAdditionalInfoRepository addlRepository;
	
	@Override
	public FixedAssetAdditionalInfo findByProdRefId(String prodRefId) {
		return addlRepository.findByProdRefId(prodRefId);
	}

	@Override
	public List<FixedAssetAdditionalInfoTnx> findByProdRefIdAndFixedAssetTnxSeqId(String prodRefId,
			String fixedAssetTnxSeqId) throws FamApplicationException {
		// TODO Auto-generated method stub
		return null;
	}

}
