package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "BBI_USER_FUNC_LIST")
@NoArgsConstructor
public class UserFunction implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "USER_LIMITS_MST_SEQ_ID", columnDefinition = "VARCHAR(50) NOT NULL", updatable = false, nullable = false)
	private String id;

	@Column(name = "USERNAME")
	private String username;

	@Column(name = "ENTITY")
	private String entity;

	@Column(name = "FUNCTION_CODE")
	private String code;

	@Column(name = "BUSINESS_DATE")
	private Date businessDate;
}
