package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "BBI_USER_MATRIX_MST")
@NoArgsConstructor
public class UserMatrixMaster {

	@Id
	@Column(name = "USER_MATRIX_MST_SEQ_ID", columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String id;
	
	@Column(name = "ENTITY")
	private String entity;
	
	@Column(name = "GROUP_CODE")
	private String groupCode;
	
	@Column(name = "BRANCH_CODE")
	private String branchCode;
	
	@Column(name = "REGION_CODE")
	private String regionCode;
	
	@Column(name = "BUSINESS_DATE")
	private Date businessDate;
	
	@Column(name = "DEPT_CODE")
	private String deptCode;
	
	@Column(name = "TXN_ID",columnDefinition="VARCHAR(255)")
	private String txnId;

	public UserMatrixMaster(UserMatrixTxn txn) {
		this.id = txn.getId();
		this.entity = txn.getEntity();
		this.groupCode = txn.getGroupCode();
		this.branchCode = txn.getBranchCode();
		this.regionCode = txn.getRegionCode();
		this.businessDate = txn.getBusinessDate();
		this.deptCode = txn.getDeptCode();
		this.txnId = txn.getId();
	}
}
