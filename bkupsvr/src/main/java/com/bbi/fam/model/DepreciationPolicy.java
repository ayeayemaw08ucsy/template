package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "bbi_dep_policy_mst")
@Getter
@Setter
public class DepreciationPolicy implements Serializable {

	@Column(name = "entity" , columnDefinition="VARCHAR(4)")
	private String entity;
	
	@Id
	@Column(name = "dep_policy_seq_id" , columnDefinition="VARCHAR(50) NOT NULL", updatable=false )
	private String depPolicySeqId;
	
	@Column(name = "asset_type" , columnDefinition="VARCHAR(3)")
	private String assetType;
	
	@Column(name = "asset_sub_type" , columnDefinition="VARCHAR(3)")
	private String assetSubType;

	@Column(name = "depreciation_method" , columnDefinition="VARCHAR(20)")
	private String depMethod;
	
	@Column(name = "depreciation_Rate" , length=2)
	private Integer depRate;
	
	@Column(name = "depreciation_coll_frequency" , columnDefinition="VARCHAR(15)")
	private String depCollFrequency;
	
	@Column(name = "depreciation_usefullife" , length=2)
	private Integer depUsefulLife;
	
	@Column(name = "business_date" , columnDefinition="DATE NOT NULL")
	private Date businessDate;
	
	//@OneToMany(mappedBy = "depreciation", cascade = CascadeType.ALL)
//	private Set<DepreciationPolicyTnx> depPolicyTnx;

	@Override
	public String toString() {
		return "DepreciationPolicy [entity=" + entity + ", depPolicySeqId=" + depPolicySeqId + ", assetType="
				+ assetType + ", assetSubType=" + assetSubType + ", depMethod=" + depMethod + ", depRate=" + depRate
				+ ", depCollFrequency=" + depCollFrequency + ", depUsefulLife=" + depUsefulLife + ", businessDate="
				+ businessDate ;
	}

	
	
}
