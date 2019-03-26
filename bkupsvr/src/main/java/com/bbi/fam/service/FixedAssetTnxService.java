package com.bbi.fam.service;

import java.sql.SQLException;
import java.util.List;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.CodeValueTnx;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.model.FixedAssetTnx;
import com.bbi.fam.model.PictureAndQRInfoTnx;

public interface FixedAssetTnxService {
	
	FixedAssetTnx save(FixedAssetTnx fixedAssetTnx);
    List<FixedAssetTnx> findAll();
    FixedAssetTnx findOne(String fixedAssetTnxSeqId);
    List<FixedAssetTnx> findByTnxStatusCode(String tnxStatusCode);
    FixedAsset delete(String id) throws FamApplicationException, Exception;
    FixedAssetTnx update(FixedAssetTnx fixedAssetTnx)throws FamApplicationException;
    List<FixedAssetTnx> getAllFixedAssetTnx();
    FixedAssetTnx requestForRegister(FixedAssetTnx fixedAsset)throws FamApplicationException, SQLException;
    FixedAsset completeRegister(FixedAsset fixedAsset)throws FamApplicationException, SQLException;
    List<FixedAssetTnx> getTasks(String assignee);
    FixedAssetTnx findByProductRefIdAndProdStatusCodeAndTnxStatusCodeAndTnxTypeAndTnxSubType(String prodRefId, String prodStatusCode, String tnxStatusCode, String tnxType, String tnxSubType) throws FamApplicationException;
    FixedAssetTnx findByProductRefIdAndProdStatusCodeAndTnxStatusCode(String prodRefId, String prodStatusCode, String tnxStatusCode) throws FamApplicationException;
    FixedAssetAdditionalInfoTnx findByfixedAssetTnx(FixedAssetTnx tnx) throws FamApplicationException;
    List<FixedAsset> findByProdStatusCodeAndTnxStatusCodeAndTnxType( String prodStatusCode, String tnxStatusCode, String tnxType) throws FamApplicationException;
    
    FixedAssetTnx saveAsDraftForUpdate(FixedAssetTnx fixedAsset) throws FamApplicationException;
    FixedAssetTnx saveAsDraftForDispose(FixedAssetTnx fixedAsset) throws FamApplicationException;
    FixedAssetTnx completeForUpdate(FixedAssetTnx fixedAsset) throws FamApplicationException;
    FixedAssetTnx completeForDispose(FixedAssetTnx fixedAsset) throws FamApplicationException;
    
    List<FixedAssetTnx>  findAllByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String  fixedAssetMstSeqId) throws FamApplicationException;
    List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId(String prodRefId, String fixedAssetAddlMstSeqId,String fixedAssetTnxSeqId) throws FamApplicationException;
    
    List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqId(String prodRefId, String fixedAssetAddlMstSeqId) throws FamApplicationException;
    
    public List<FixedAssetTnx> getPendingTasks(String assignee);
    
    public List<FixedAssetTnx> getPendingDisposeTasks(String assignee);
    
    public List<FixedAssetTnx> getCompletingTasks(String assignee);
    
    List<FixedAssetTnx>  findByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String  fixedAssetMstSeqId, String tnxStatusCode, String tnxType, String tnxSubType) throws FamApplicationException;
    
    List<FixedAssetTnx> findAllByTnxStatusCodeAndTnxType(String tnxStatusCode, String tnxType);
    
    public void generate (String prodRef);
    
    PictureAndQRInfoTnx findPictureByfixedAssetTnx(FixedAssetTnx tnx) throws FamApplicationException;
    
    
}
