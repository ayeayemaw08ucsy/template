package com.bbi.fam.service;

import java.util.HashSet;
import java.util.List;

import com.bbi.fam.model.Code;
import com.bbi.fam.model.DepreciationPolicy;

public interface DepreciationPolicyService {
    DepreciationPolicy save(HashSet<DepreciationPolicy> depreication);
    List<DepreciationPolicy> findAll();
    void delete(String id);
    DepreciationPolicy findOne(String depPolicySeqId);
    DepreciationPolicy findByAssetTypeAndAssetSubType(String assetType, String assetSubType);
 }
