package com.bbi.fam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bbi.fam.dto.AssetDto;
import com.bbi.fam.model.FixedAsset;

@Repository
public interface FixedAssetRepository  extends CrudRepository<FixedAsset, String> {
	
	FixedAsset findByProdRefId(String prodRefId);

	@Modifying
	@Query("Delete From FixedAsset fxa Where fxa.fixedAssetMstSeqId = :fixedAssetMstSeqId ")
	void deleteByFixedAssetMstSeqId(@Param("fixedAssetMstSeqId") String fixedAssetMstSeqId);

	FixedAsset findByFixedAssetMstSeqId(String fixedAssetMstSeqId);
	
	@Query("SELECT fxa FROM FixedAsset fxa")
	List<FixedAsset> getAllFixedAssets();
	
	@Query("SELECT new com.bbi.fam.dto.AssetDto(" + "sum(fa.bookAmt) as data," + "fa.assetType as label" + ") from FixedAsset fa group by fa.assetType")
	List<AssetDto> findByAssetType();

}
