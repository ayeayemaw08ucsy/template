package com.bbi.fam.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "BBI_DEPRECIATION_TXN")
@NoArgsConstructor
public class DepreciationProcessTxn {
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
	
	@Column(name = "ASSET_TYPE")
	private String assetType;
	
	@Column(name = "ASSET_SUB_TYPE")
	private String assetSubType;
	
	@Column(name = "DEPRECIATION_METHOD")
	private String depreciationMethod;
	
	@Column(name = "DEPRECIATION_RATE")
	private BigDecimal depreciationRate;
	
	@Column(name = "DEPRECIATION_COLL_FREQ")
	private String depreciationCollFreq;
	
	@Column(name = "RESIDUAL_CCY")
	private String residualCcy;
	
	@Column(name = "RESIDUAL_VALUE")
	private BigDecimal residualValue;
	
	@Column(name = "ACCM_DEPRECIATION_CCY")
	private String accmDepreciationCcy;
	
	@Column(name = "ACCM_DEPRECIATION_AMT")
	private BigDecimal accmDepreciationAmt;
	
	@Column(name = "BUSINESS_DATE")
	private Date businessDate;
	
	@Column(name = "BOOK_CCY")
	private String bookCcy;
	
	@Column(name = "BOOK_AMT")
	private BigDecimal bookAmt;
	
	@Column(name = "DEP_SEQ")
	private int depSeq;
	
	@Column(name = "COLLECTED_TO_DATE")
	private Date collectedToDate;
	
	@Column(name = "DEPRECIATION_CCY")
	private String depreciationCcy;
	
	@Column(name = "DEPRECIATION_AMT")
	private BigDecimal depreciationAmt;
	
	@Column(name = "TNX_ID")
	private String tnxId;
	
	@Column(name = "TNX_TYPE")
	private String tnxType;
	
	@Column(name = "TNX_SUB_TYPE")
	private String tnxSubType;

}
