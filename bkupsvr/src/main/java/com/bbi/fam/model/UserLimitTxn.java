package com.bbi.fam.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "BBI_USER_LIMITS_TXN")
public class UserLimitTxn {
	@Id
	@Column(name = "USER_LIMITS_TNX_SEQ_ID", columnDefinition="VARCHAR(50) NOT NULL", updatable=false ,nullable = false)
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
	
	@Column(name = "TXN_STATUS_CODE")
	private String txnStatusCode;
	
	@Column(name = "INPUT_USER")
	private String inputUser;
	
	@Column(name = "APPROVE_USER")
	private String approveUser;
	
	@Column(name = "APPROVE_DATE")
	private Date approveDate;
	
	@Column(name = "TASK_ID")
	private String taskId;

}
