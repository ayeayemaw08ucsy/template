package com.bbi.fam.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "BBI_USER_LIMITS_MST")
public class UserLimitMaster {
	@Id
	@Column(name = "USER_LIMITS_MST_SEQ_ID", columnDefinition="VARCHAR(50) NOT NULL", updatable=false ,nullable = false)
	private String id;
	
	@Column(name = "ENTITY")
	private String entity;
	
	@Column(name = "CODE_DESC")
	private String codeDesc;
	
	@Column(name = "LEVEL_CODE")
	private String levelCode;
	
	@Column(name = "INPUT_LIMIT")
	private BigDecimal inputLimit;
	
	@Column(name = "APPROVE_LIMIT")
	private BigDecimal approveLimit;
	
	@Column(name = "BUSINESS_DATE")
	private Date businessDate;
	
	@Column(name = "USER_LIMITS_TXN_ID")
	private String txnId;

	public UserLimitMaster(UserLimitTxn txn) {
		this.id = txn.getId();
		this.entity = txn.getEntity();
		this.codeDesc = txn.getCodeDesc();
		this.levelCode = txn.getLevelCode();
		this.inputLimit = txn.getInputLimit();
		this.approveLimit = txn.getApproveLimit();
		this.businessDate = txn.getBusinessDate();
		this.txnId = txn.getId();
	}
	
	
	
}
