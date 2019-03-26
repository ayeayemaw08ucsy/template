package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.FixedAssetAdditionalInfoTnx;
import com.bbi.fam.model.FixedAssetTnx;

public interface FixedAssetAdditionalInfoTnxRepository extends CrudRepository<FixedAssetAdditionalInfoTnx, String>  {
	
	FixedAssetAdditionalInfoTnx findByProdRefId(String prodRefId);
	FixedAssetAdditionalInfoTnx findByfixedAssetTnx(FixedAssetTnx tnx);
	void deleteByFixedAssetTnx(FixedAssetTnx fixedAssetTnx);

	
	@Query("Select tnx FROM FixedAssetAdditionalInfoTnx tnx where tnx.prodRefId = ?1 and tnx.fixedAssetAdditionalInfo.fixedAssetAddlMstSeqId = ?2 and tnx.fixedAssetTnx.fixedAssetTnxSeqId = ?3 order by tnx.prodRefId,tnx.businessDate,tnx.fixedAssetAdditionalInfo.fixedAssetAddlMstSeqId DESC")
	List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqIdAndFixedAssetTnxSeqId(String prodRefId, String fixedAssetAddlMstSeqId, String fixedAssetTnxSeqId)  throws FamApplicationException;

	@Query("Select tnx FROM FixedAssetAdditionalInfoTnx tnx where tnx.prodRefId = ?1 and tnx.fixedAssetAdditionalInfo.fixedAssetAddlMstSeqId = ?2  order by tnx.prodRefId,tnx.businessDate DESC")
	List<FixedAssetAdditionalInfoTnx> findAllByProdRefIdAndFixedAssetAddlMstSeqId(String prodRefId, String fixedAssetAddlMstSeqId)  throws FamApplicationException;


}
