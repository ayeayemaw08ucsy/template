package com.bbi.fam.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;

@Entity
@Data
@Table(name = "bbi_fa_addl_mst")
public class FixedAssetAdditionalInfo implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3744829823498256150L;
	
	@Id
    @Column(name = "fa_addl_mst_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String fixedAssetAddlMstSeqId;
	
	@Column(name = "entity", columnDefinition="VARCHAR(4)")
	private String entity;
	
	@Column(name = "prod_code", columnDefinition="VARCHAR(4)")
	private String productCode;
	
	@Column(name = "prod_ref_id", columnDefinition="VARCHAR(50)", unique = true)
	private String prodRefId;
	
	@Column(name = "business_date")
	private Date businessDate;
	
	@Column(name = "note_1", columnDefinition="VARCHAR(255)")
	private String note1;
	
	@Column(name = "note_2", columnDefinition="VARCHAR(255)")
	private String note2;
	
	@Column(name = "note_3", columnDefinition="VARCHAR(255)")
	private String note3;
	
	@Column(name = "note_4", columnDefinition="VARCHAR(255)")
	private String note4;
	
	@Column(name= "ins_vendor_code",columnDefinition="VARCHAR(3)")
	private String insuranceCode;
	
	@Column(name = "insu_name", columnDefinition="VARCHAR(50)")
	private String insuranceName;
	
//	@Column(name = "insu_loc", columnDefinition="VARCHAR(255)")
//	private String insuranceLocation;
	
	@Column(name = "insu_type", columnDefinition="VARCHAR(60)")
	private String insuranceType;
	
	@Column(name = "insu_from")
	private Date insuranceFrom;
	
	@Column(name = "insu_to")
	private Date insuranceTo;
	
	@Column(name="wrt_vendor_code", columnDefinition="VARCHAR(3)")
	private String warrantyCode;
	
	@Column(name = "wrty_name", columnDefinition="VARCHAR(50)")
	private String warrantyName;
	
//	@Column(name = "wrty_loc", columnDefinition="VARCHAR(255)")
//	private String warrantyLocation;
//	
	@Column(name = "wrty_type", columnDefinition="VARCHAR(60)")
	private String warrantyType;
	
	@Column(name = "wrty_from")
	private Date warrantyFrom;
	
	@Column(name = "wrty_to")
	private Date warrantyTo;
	
	@Column(name="sup_vendor_code", columnDefinition="VARCHAR(3)")
	private String supportCode;
	
	@Column(name = "sup_name", columnDefinition="VARCHAR(50)")
	private String supportName;
	
//	@Column(name = "sup_loc", columnDefinition="VARCHAR(255)")
//	private String supportLocation;
	
	@Column(name = "sup_type", columnDefinition="VARCHAR(60)")
	private String supportType;
	
	@Column(name = "sup_from")
	private Date supportFrom;
	
	@Column(name = "sup_to")
	private Date supportTo;
	
	@Column(name="tax_vendor_code" , columnDefinition="VARCHAR(3)")
	private String taxCode;
	
	@Column(name = "tax_type", columnDefinition="VARCHAR(60)")
	private String taxType;
	
	@Column(name = "tax_name", columnDefinition="VARCHAR(60)")
	private String taxName;
	
	@Column(name = "tax_rate", columnDefinition="VARCHAR(60)")
	private String taxRate;
	
	@Column(name = "tax_currency", columnDefinition="VARCHAR(4)")
	private String taxCurrency;
	
	@Column(name = "tax_amount")
	private BigDecimal taxAmount;
	
	@Column(name="fin_vendor_code" , columnDefinition="VARCHAR(3)")
	private String financeCode;
	
	@Column(name="finance_name" , columnDefinition="VARCHAR(60)")
	private String financeName;
	
	@Column(name = "finance_type", columnDefinition="VARCHAR(60)")
	private String financeType;
	
	@Column(name = "finance_currency", columnDefinition="VARCHAR(4)")
	private String financeCurrency;
	
	@Column(name = "finance_amt")
	private BigDecimal financeAmt;
	
	@Column(name = "rate")
	private BigDecimal rate;
	
	@Column(name = "finance_from")
	private Date financeFrom;
	
	@Column(name = "finance_to")
	private Date financeTo;
	
	@Transient
	private String fixedAssetAddlTnxSeqId;
	
}
