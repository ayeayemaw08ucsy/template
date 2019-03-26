package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAsset;
import com.bbi.fam.model.FixedAssetTnx;

@Repository
public interface FixedAssetTnxRepository  extends CrudRepository<FixedAssetTnx, String> {
	
	FixedAssetTnx findByFixedAssetTnxSeqId(String fixedAssetTnxSeqId);
	void deleteByFixedAssetTnxSeqId(String fixedAssetTnxSeqId);
	FixedAssetTnx findByProdRefIdAndTnxStatusCode(String prodRefId, String tnxStatusCode);
	
	@Query("SELECT fatnx FROM FixedAssetTnx fatnx WHERE fatnx.tnxStatusCode = :tnxStatusCode ")
	List<FixedAssetTnx> findByTnxStatusCode(@Param("tnxStatusCode") String tnxStatusCode);
	FixedAssetTnx findByProdRefIdAndProdStatusCodeAndTnxStatusCodeAndTnxTypeAndTnxSubType(String prodRefId, String prodStatusCode, String tnxStatusCode, String tnxType, String tnxSubType)throws FamApplicationException;
	FixedAssetTnx findByProdRefIdAndProdStatusCodeAndTnxStatusCode(String prodRefId, String prodStatusCode, String tnxStatusCode) throws FamApplicationException;
	List<FixedAssetTnx> findByProdStatusCodeAndTnxStatusCodeAndTnxType( String prodStatusCode, String tnxStatusCode, String tnxType) throws FamApplicationException;

	
	@Query("Select tnx FROM FixedAssetTnx tnx where tnx.prodRefId = ?1 and tnx.fixedAsset.fixedAssetMstSeqId = ?2 order by tnx.prodRefId,tnx.businessDate,tnx.fixedAsset.fixedAssetMstSeqId DESC")
	List<FixedAssetTnx> findByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String fixAssetMstSeqId)  throws FamApplicationException;
    
	@Query("Select tnx FROM FixedAssetTnx tnx where tnx.prodRefId = ?1 and tnx.fixedAsset.fixedAssetMstSeqId = ?2 and tnx.tnxStatusCode = ?3 and tnx.tnxType = ?4 and tnx.tnxSubType = ?5  order by tnx.prodRefId,tnx.businessDate,tnx.fixedAsset.fixedAssetMstSeqId DESC")
	List<FixedAssetTnx> findByProdRefIdAndFixedAssetMstSeqId(String prodRefId, String fixAssetMstSeqId, String tnxStatusCode, String tnxType, String tnxSubType)  throws FamApplicationException;
   
	FixedAssetTnx findByTaskIdAndTaskName(String taskId,String taskName);
    FixedAssetTnx findByFixedAsset(FixedAsset fixedAsset);
    
    List<FixedAssetTnx> findAllByTnxStatusCodeAndTnxType(String tnxStatusCode, String tnxType);

}
