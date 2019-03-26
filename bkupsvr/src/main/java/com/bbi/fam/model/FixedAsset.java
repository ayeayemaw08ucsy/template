package com.bbi.fam.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.bbi.fam.exception.ApiError;

import lombok.Data;

@Entity
@Data
@Table(name = "bbi_fixedasset_mst")
public class FixedAsset implements Serializable {

	/**
	 *  Serial Version UID
	 */
	private static final long serialVersionUID = 919201000108279891L;
	
	@Id
    @Column(name = "fixedasset_mst_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String fixedAssetMstSeqId;
	
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
	
	@Column(name = "prod_stat_code", columnDefinition="VARCHAR(4)")
	private String prodStatusCode;	
	
	@Column(name = "tnx_type", columnDefinition="VARCHAR(4)")
	private String tnxType;
	
	@Column(name = "current_collected_period")
	private int currentCollectedPeriod;
	
	@Column(name = "collection_periods_per_freq")
	private Date collectionPeriodsPerFreq;
	
	@Column(name = "last_collection_date")
	private Date lastCollectionDate;
	
	@Column(name = "next_collection_date")
	private Date nextCollectionDate;
	
	@Column(name = "need_depreciate")
	private boolean needDepreciate;
	
	@Transient
	private ApiError apiError;
	
	@Transient
	private FixedAssetAdditionalInfo addlInfo;
	
	@Transient
	private PictureAndQRInfo imgInfo;
	
	@Transient
	private String fixedAssetTnxSeqId;
	
	@Transient
	private boolean register;
	
	@Transient
	private FixedAssetAdditionalInfo addlInfoMst;
	
	@Transient
	private FixedAssetAdditionalInfoTnx addlInfoTnx;
	
	@Transient
	private PictureAndQRInfo pictureAndQRInfoMst;
	
	@Transient
	private PictureAndQRInfoTnx pcQrInfoTnx;
	
	@Transient
	private boolean draft;
	
	@Transient
	private boolean amend;
	
	@Transient
	private boolean amendApprove;
	
	@Transient
	private String tnxStatusCode;
	
	@Transient
	private String inputUser;
	
	@Transient
	private String assetTracking;
	
	@Transient
	private boolean authorize;

}
