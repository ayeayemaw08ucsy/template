package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Length;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "BBI_WEEKLYWORK_POLICY")
public class WeeklyPolicy implements Serializable {

	@Id
	@Column(name = "WORKDAY_SEQ_ID")
	@Length(max = 100)
	private String id;

	@Column(name = "MONDAY")
	private boolean monday;

	@Column(name = "TUESDAY")
	private boolean tuesday;

	@Column(name = "WEDNESDAY")
	private boolean wednesday;

	@Column(name = "THURSDAY")
	private boolean thursday;

	@Column(name = "FRIDAY")
	private boolean friday;

	@Column(name = "SATURDAY")
	private boolean saturday;

	@Column(name = "SUNDAY")
	private boolean sunday;

	@Column(name = "TXN_STATUS_CODE")
	private String txnStatusCode;

	@Column(name = "INP_USER")
	private String inputUser;

	@Column(name = "INP_DATE")
	private String inputDate;

	@Column(name = "BUSINESS_DATE")
	private Date businessDate;

	@Column(name = "APPR_USER")
	private String approveUser;

	@Column(name = "APPR_DATE")
	private Date approveDate;
}
