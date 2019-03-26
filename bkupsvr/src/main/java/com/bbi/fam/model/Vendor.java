package com.bbi.fam.model;

import java.util.Date;
import java.util.Set;

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

import com.bbi.fam.exception.ApiError;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Table(name = "bbi_vendor_mst")
public class Vendor {
	
	@Id
	@Column(name = "vendor_seq_id", columnDefinition="varchar(50)")
	private String vendorSeqId;
	
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
	
	@Column(name = "address", columnDefinition="varchar(255)")
	private String address;
	
	@Column(name = "pin_code", columnDefinition="varchar(8)")
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
	
	@Transient
	private ApiError apiError;
	
}
