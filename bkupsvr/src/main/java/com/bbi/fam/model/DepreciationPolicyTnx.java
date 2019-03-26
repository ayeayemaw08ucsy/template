package com.bbi.fam.model;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bbi_dep_policy_tnx")
@Getter
@Setter
@JsonIgnoreProperties
public class DepreciationPolicyTnx implements Serializable{
	@Column(name = "entity" , columnDefinition ="VARCHAR(4)")
	private String entity;
	
	@Id
	@Column(name = "dep_policy_tnx_seq_id" , columnDefinition="VARCHAR(50) NOT NULL", updatable=false ,nullable = false)
	private String  depPloicyTnxSeqId;
	
	@Column(name = "asset_type" , columnDefinition="VARCHAR(2)")
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
	private Date business_date;
	
	//need to check
	@Column(name = "tnx_status_code" , columnDefinition="VARCHAR(15)")
	private String tnxStatusCode;
	
	@Column(name = "tnx_type" , columnDefinition="VARCHAR(3)")
	private String tnxType;
	
	@Column(name = "tnx_sub_type" , columnDefinition="VARCHAR(3)")
	private String tnxSubType;
	
	@Column(name = "inp_user" , columnDefinition="VARCHAR(50)")
	private String inputUserId;
	
	@Column(name = "appr_user" , columnDefinition="VARCHAR(50)")
	private String approveUserId;
	
	@Column(name = "inp_dttm")
	private Date inputDateTime;
	
	@Column(name = "app_dttm" )
	private Date approveDateTime;
	
	@ManyToOne(cascade= CascadeType.ALL,fetch = FetchType.LAZY)
	@JoinColumn(columnDefinition="VARCHAR(50)  DEFAULT NULL",name="dep_policy_seq_id")
	private DepreciationPolicy depreciation;

	@Column(name = "TASK_ID", columnDefinition="VARCHAR(50)")
	private String taskId;
	
	@Override
	public String toString() {
		return "DepreciationPolicyTnx [entity=" + entity + ", depPloicyTnxSeqId=" + depPloicyTnxSeqId + ", assetType="
				+ assetType + ", assetSubType=" + assetSubType + ", depMethod=" + depMethod + ", depRate=" + depRate
				+ ", depCollFrequency=" + depCollFrequency + ", depUsefulLife=" + depUsefulLife + ", business_date="
				+ business_date + ", tnxStatusCode=" + tnxStatusCode + ", tnxType=" + tnxType + ", tnxSubType="
				+ tnxSubType + ", inputUserId=" + inputUserId + ", approveUserId=" + approveUserId + ", inputDateTime="
				+ inputDateTime + ", approveDateTime=" + approveDateTime + ", depreciation=" + depreciation
				+ ", getEntity()=" + getEntity() + ", getDepPloicyTnxSeqId()=" + getDepPloicyTnxSeqId()
				+ ", getAssetType()=" + getAssetType() + ", getAssetSubType()=" + getAssetSubType()
				+ ", getDepMethod()=" + getDepMethod() + ", getDepRate()=" + getDepRate() + ", getDepCollFrequency()="
				+ getDepCollFrequency() + ", getDepUsefulLife()=" + getDepUsefulLife() + ", getBusiness_date()="
				+ getBusiness_date() + ", getTnxStatusCode()=" + getTnxStatusCode() + ", getTnxType()=" + getTnxType()
				+ ", getTnxSubType()=" + getTnxSubType() + ", getInputUserId()=" + getInputUserId()
				+ ", getApproveUserId()=" + getApproveUserId() + ", getInputDateTime()=" + getInputDateTime()
				+ ", getApproveDateTime()=" + getApproveDateTime() + ", getDepreciation()=" + getDepreciation()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString()
				+ "]";
	}
	
	
	
}
