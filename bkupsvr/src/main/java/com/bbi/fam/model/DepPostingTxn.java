package com.bbi.fam.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "BBI_DEP_POSTINGS_TNX")
@NoArgsConstructor
public class DepPostingTxn {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "ENTITY")
	private String entity;
	
	@Column(name = "PROD_CODE")
	private String prodCode;
	
	@Column(name = "PROD_REF_ID")
	private String prodRefId;
	
	@Column(name = "BUSINESS_DATE")
	private String businessDate;
	
	@Column(name = "DEBIT_CCY")
	private String debitCcy;
	
	@Column(name = "DEBIT_AMT")
	private BigDecimal debitAmt;
	
	@Column(name = "DEBIT_ACCOUNT")
	private String debitAccount;
	
	@Column(name = "DEBIT_TYPE")
	private String debitType;
	
	@Column(name = "CREDIT_CCY")
	private String creditCcy;
	
	@Column(name = "CREDIT_AMT")
	private BigDecimal creditAmt;
	
	@Column(name = "CREDIT_ACCOUNT")
	private String creditAccount;
	
	@Column(name = "CREDIT_TYPE")
	private String creditType;
	
	@Column(name = "TNX_ID")
	private String tnxId;
	
	@Column(name = "TNX_TYPE")
	private String tnxType;
	
	@Column(name = "TNX_SUB_TYPE")
	private String tnxSubType;

	@Column(name = "REF_1")
	private String refOne;
	
	@Column(name = "REF_2")
	private String refTwo;
	
	public DepPostingTxn(String entity, String prodCode, String prodRefId, String businessDate, String debitCcy,
			BigDecimal debitAmt, String debitAccount, String debitType, String creditCcy, BigDecimal creditAmt,
			String creditAccount, String creditType, String tnxId, String tnxType, String tnxSubType, String refOne, String refTwo) {
		this.entity = entity;
		this.prodCode = prodCode;
		this.prodRefId = prodRefId;
		this.businessDate = businessDate;
		this.debitCcy = debitCcy;
		this.debitAmt = debitAmt;
		this.debitAccount = debitAccount;
		this.debitType = debitType;
		this.creditCcy = creditCcy;
		this.creditAmt = creditAmt;
		this.creditAccount = creditAccount;
		this.creditType = creditType;
		this.tnxId = tnxId;
		this.tnxType = tnxType;
		this.tnxSubType = tnxSubType;
		this.refOne = refOne;
		this.refTwo = refTwo;
	}

}
