package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Data;

@Entity
@Data
@Table(name = "bbi_branch_tnx")
public class BranchTnx {
	
	@Id
    @Column(name = "branch_tnx_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String branchTnxSeqId;
	
	@Column(name = "entity")
	private String entity;
	
	@Column(name = "branch_code")
	private String branchCode;
	
	@Column(name = "branch_desc")
	private String branchDesc;
	
	@Column(name = "name_1")
	private String name1;
	
	@Column(name = "name_2")
	private String name2;
	
	@Column(name = "address")
	private String address;
	
	@Column(name = "pin_code")
	private String pinCode;
	
	@Column(name = "active_status")
	private String activeStatus;
	
	@Column(name = "country")
	private String country;
	
	@Column(name = "region")
	private String region;
	
	@Column(name = "business_date")
	private Date businessDate;
	
	@Column(name = "tnx_type")
	private String tnxType;
	
	@Column(name = "tnx_sub_type")
	private String tnxSubType;
	
	@Column(name = "tnx_status_code")
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
	@JoinColumn(name = "branch_mst_seq_id", referencedColumnName = "branch_mst_seq_id", columnDefinition="varchar(50)", nullable=true)
	private Branch branch;
	
	@Transient
	private boolean authorize;
	
}
