package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.bbi.fam.exception.ApiError;

import lombok.Data;

@Entity
@Data
@Table(name = "bbi_branch_mst")
public class Branch {
	
	@Id
    @Column(name = "branch_mst_seq_id" , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String branchSeqId;
	
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
	
	@Transient
	private ApiError apiError;
	
}
