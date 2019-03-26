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
@Table(name = "bbi_img_addl_mst")
public class PictureAndQRInfo implements Serializable {

	/**
	 *  Serial Version UID
	 */
	private static final long serialVersionUID = -1125558260484784152L;
	
	@Id
    @Column(name = "img_addl_mst_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String pictureAndQrSeqId;
	
	@Column(name = "entity", columnDefinition="VARCHAR(4)")
	private String entity;
	
	@Column(name = "prod_code", columnDefinition="VARCHAR(4)")
	private String productCode;
	
	@Column(name = "prod_ref_id", columnDefinition="VARCHAR(50)", unique = true)
	private String prodRefId;
	
	@Column(name = "business_date")
	private Date businessDate;
	
	@Column(name = "tracking_code")
	private String trackingCode;
	
	@Column(name = "tracking_file_name")
	private String trackingFileName;
	
	@Column(name = "tracking_file_loc")
	private String trackingFileLocation;
	
	@Column(name = "tracking_created_date")
	private Date trackingCreateDate;
	
	@Column(name = "verified_date")
	private Date verifiedDate;
	
	@Column(name = "verified_code")
	private String verifiedCode;
	
	@Column(name = "verified_file_name")
	private String verifiedFileName;
	
	@Column(name = "verified_file_loc")
	private String verifiedFileLocation;
	
	@Column(name = "picture_code")
	private String pictureCode;
	
	@Column(name = "picture_name")
	private String pictureFileName;
	
	@Column(name = "picture_file_loc")
	private String pictureFileLocation;
	
	@Column(name = "picture_capture_date")
	private Date pictureCaptureDate;
	
	@Transient
	private String pictureAndQrTnxSeqId;
	
}
