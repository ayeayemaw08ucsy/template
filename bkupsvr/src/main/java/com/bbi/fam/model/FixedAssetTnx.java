package com.bbi.fam.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;

@Entity
@Data
@Table(name = "bbi_fixedasset_tnx")
public class FixedAssetTnx implements Serializable {

	/**
	 *  Serial Version UID
	 */
	private static final long serialVersionUID = -8347095116858022915L;
	
	@Id
    @Column(name = "fixedasset_tnx_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String fixedAssetTnxSeqId;
	
	@ManyToOne(cascade= {CascadeType.PERSIST, CascadeType.MERGE}, fetch=FetchType.LAZY)
	@JoinColumn(name = "fixedasset_mst_seq_id", referencedColumnName = "fixedasset_mst_seq_id", columnDefinition="varchar(50)", nullable=true)
	private FixedAsset fixedAsset;
	
	@Column(name = "entity", columnDefinition="VARCHAR(4)")
	private String entity;
	
	@Column(name = "prod_code", columnDefinition="VARCHAR(4)")
	private String productCode;
	
	@Column(name = "asset_type", columnDefinition="VARCHAR(4)")
	private String assetType;
	
	@Column(name = "asset_sub_type", columnDefinition="VARCHAR(4)")
	private String assetSubType;
	
	@Column(name = "prod_ref_id", columnDefinition="VARCHAR(50)")
	private String prodRefId;
	
	/*@Column(name = "requester_id", columnDefinition="VARCHAR(10)")
	private String requester;*/
	
	@Column(name = "business_date")
	private Date businessDate;
	
	@Column(name = "inv_date")
	private Date invoiceDate;
	
	@Column(name = "inv_ref", columnDefinition="VARCHAR(20)")
	private String invoiceRef;
	
	@Column(name = "inv_unit_price")
	private BigDecimal invUnitPrice;
	
	@Column(name = "inv_qty")
	private int invQuantity;
	
	@Column(name = "inv_ccy", columnDefinition="VARCHAR(4)")
	private String invCurrency;
	
	@Column(name = "inv_amt")
	private BigDecimal invAmount;
	
	@Column(name = "exch_rate")
	private BigDecimal exchRate;
	
	@Column(name = "tnx_ccy", columnDefinition="VARCHAR(4)")
	private String tnxCurrency;
	
	@Column(name = "tnx_amt")
	private BigDecimal tnxAmount;
	
	@Column(name = "book_ccy", columnDefinition="VARCHAR(4)")
	private String bookCurrency;
	
	@Column(name = "book_amt")
	private BigDecimal bookAmt;
	
	@Column(name = "purchase_date")
	private Date purchaseDate;
	
	@Column(name = "asset_desc_1", columnDefinition="VARCHAR(255)")
	private String assetDesc1;
	
	@Column(name = "asset_desc_2", columnDefinition="VARCHAR(255)")
	private String assetDesc2;
	
	@Column(name = "asset_model", columnDefinition="VARCHAR(25)")
	private String assetModel;
	
	@Column(name = "asset_serial_no", columnDefinition="VARCHAR(30)")
	private String serialNo;
	
	@Column(name = "unique_id", columnDefinition="VARCHAR(30)")
	private String uniqueId;
	
	@Column(name = "asset_quantity")
	private int assetQuantity;
	
	@Column(name = "branch_code", columnDefinition="VARCHAR(5)")
	private String branchCode;
	
	@Column(name = "dept_code", columnDefinition="VARCHAR(5)")
	private String deptCode;
	
	@Column(name = "depreciation_method", columnDefinition="VARCHAR(20)")
	private String depMethod;
	
	@Column(name = "depreciation_rate")
	private BigDecimal depRate;
	
	/** useful life in months of fixed assets. (policy.usefulLife * 12). months can be more flexible for comparing life when depreciation calculate. **/
	@Column(name = "useful_life")
	private int depUsefulLife;
	
	@Column(name = "depreciation_coll_freq", columnDefinition="VARCHAR(4)")
	private String depCollFrequency;
	
	@Column(name = "residual_ccy", columnDefinition="VARCHAR(4)")
	private String residualCurrency;
	
	@Column(name = "residual_value")
	private BigDecimal residualValue;
	
	@Column(name = "accum_depreciation_ccy", columnDefinition="VARCHAR(4)")
	private String accumDepCurrency;
	
	@Column(name = "accum_depreciation_amt")
	private BigDecimal accumDepAmt;
	
	/** this is the frequency that've already depreciated. **/
	@Column(name = "depreciation_seq")
	private int depSequence;
	
	@Column(name = "net_asset_ccy", columnDefinition="VARCHAR(4)")
	private String netAssetCurrency;
	
	@Column(name = "net_asset_amt")
	private BigDecimal netAssetAmount;
	
	@Column(name = "disposal_date")
	private Date disposalDate;
	
	@Column(name = "dispose_type", columnDefinition="VARCHAR(4)")
	private String disposeType;
	
	@Column(name = "archive_flag", columnDefinition="VARCHAR(4)")
	private String archiveFlag;
	
	@Column(name = "vendor_code", columnDefinition="VARCHAR(4)")
	private String vendorCode;
	
	@Column(name = "vendor_name", columnDefinition="VARCHAR(35)")
	private String vendorName;
	
	@Column(name = "prod_status_code", columnDefinition="VARCHAR(4)")
	private String prodStatusCode;	
	
	@Column(name = "tnx_type", columnDefinition="VARCHAR(4)")
	private String tnxType;
	
	@Column(name = "tnx_sub_type", columnDefinition="VARCHAR(4)")
	private String tnxSubType;
	
	@Column(name = "tnx_status_code", columnDefinition="VARCHAR(4)")
	private String tnxStatusCode;
	
	@Column(name = "inp_user", columnDefinition="VARCHAR(50)")
	private String inputUser;
	
	@Column(name = "inp_dttm")
	private Date inputDate;
	
	@Column(name = "appr_user", columnDefinition="VARCHAR(50)")
	private String approveUser;
	
	@Column(name = "appr_dttm")
	private Date approveDate;
	
	@Transient
	private FixedAssetAdditionalInfoTnx addlInfoTnx;
	
	@Transient
	private PictureAndQRInfoTnx imgInfoTnx;

	@Column(name = "TASK_ID", columnDefinition="VARCHAR(50)")
	private String taskId;

	@Column(name = "TASK_NAME", columnDefinition="VARCHAR(50)")
	private String taskName;
	
	@Transient
	private boolean amendApprove;
	
	@Column(name = "asset_tracking")
	private String assetTracking;
	
	@Transient
	private boolean authorize;

}
