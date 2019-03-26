package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "bbi_vendor_tnx")
@NoArgsConstructor
public class VendorTnx implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "vendor_tnx_seq_id", columnDefinition="varchar(50)")
	private String vendorTnxSeqId;
	
	@Column(name = "entity", columnDefinition="varchar(4)")
	private String entity;

	@Column(name = "vendor_code", columnDefinition="varchar(3)")
	private String vendorCode;
	
	@Column(name = "vendor_desc", columnDefinition="varchar(20)")
	private String vendorDesc;
	
	@Column(name = "name_1", columnDefinition="varchar(35)")
	private String name1;
	
	@Column(name = "name_2", columnDefinition="varchar(35)")
	private String name2;
	
	@Column(name = "address", columnDefinition="varchar(100)")
	private String address;
	
	@Column(name = "pin_code", columnDefinition="varchar(100)")
	private String pinCode;
	
	@Column(name = "phone", columnDefinition="varchar(20)")
	private String phone;
	
	@Column(name = "email", columnDefinition="varchar(60)")
	private String email;
	
	@Column(name = "country", columnDefinition="varchar(3)")
	private String country;
	
	@Column(name = "active_status", columnDefinition="varchar(10)")
	private String activeStatus;
	
	@Column(name = "business_date")
	private Date businessDate;	
	
	@Column(name = "tnx_type", columnDefinition="varchar(3)")
	private String tnxType;
	
	@Column(name = "tnx_sub_type", columnDefinition="varchar(3)")
	private String tnxSubType;
	
	@Column(name = "tnx_status_code", columnDefinition="varchar(15)")
	private String tnxStatusCode;
	
	@Column(name = "inp_user", columnDefinition="varchar(50)")
	private String inputUser;
	
	@Column(name = "inp_dttm")
	private Date inputDate;
	
	@Column(name = "appr_user", columnDefinition="varchar(50)")
	private String apprUser;
	
	@Column(name = "appr_dttm")
	private Date approverDate;
	
	@ManyToOne(cascade= {CascadeType.PERSIST, CascadeType.MERGE}, fetch=FetchType.LAZY)
	@JoinColumn(name = "vendor_seq_id", referencedColumnName = "vendor_seq_id", columnDefinition="varchar(50)", nullable = true)
	private Vendor vendor;
	
	@Transient
	private boolean authorize;
	
}
