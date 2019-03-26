package com.bbi.fam.service;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;

import com.bbi.fam.dto.GraphDto;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetTnx;

public interface FixedAssetService {
	
	FixedAsset save(FixedAsset fixedAsset);
	FixedAsset register(FixedAsset fixedAsset)throws FamApplicationException, SQLException;
    List<FixedAsset> findAllByOrderByBusinessDate();
    FixedAsset findOne(String id);
    FixedAsset delete(String id)throws FamApplicationException, Exception;
    FixedAsset update(FixedAsset fixedAsset)throws FamApplicationException;
    List<FixedAsset> getAllFixedAssets();
    FixedAsset approve(FixedAsset fixedAssetTnx)throws FamApplicationException, SQLException, ParseException ;
    FixedAsset requestForUpdate(String fixedAssetSeqId)throws FamApplicationException, SQLException ;
    FixedAsset updateApprove(FixedAssetTnx fixedAssetTnx)throws FamApplicationException, SQLException ;
    FixedAsset amendApprove(FixedAsset fixedAsset)throws FamApplicationException, SQLException ;
    FixedAssetTnx saveAsDraft(FixedAssetTnx fixedAsset)throws FamApplicationException, SQLException;
    List<FixedAsset> listForAmend();
    FixedAsset requestDataForAmend(String fixedAssetSeqId)throws FamApplicationException, SQLException ;
    FixedAsset requestForAmend(FixedAsset fixedAsset)throws FamApplicationException, SQLException ;
    FixedAsset requestDataForAmendApproval(String fixedAssetSeqId)throws FamApplicationException, SQLException ;
    GraphDto findByAssetType() ;
    FixedAsset approveForUpdate(FixedAssetTnx fixedAsset) throws FamApplicationException;
    FixedAsset approveForDispose(FixedAssetTnx fixedAsset) throws FamApplicationException;
    
}
