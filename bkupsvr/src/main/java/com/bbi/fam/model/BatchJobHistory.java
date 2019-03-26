package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bbi.fam.utils.CustomIdGeneration;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BBI_BATCH_JOB_HIST")
@Getter
@Setter
@NoArgsConstructor
public class BatchJobHistory {
	@Id
	@Column(name = "JOB_HIST_ID", columnDefinition = "VARCHAR(50)", updatable = false, nullable = false)
	private String jobHisId;

	@Column(name = "ENTITY")
	private String entity;
	
	@Column(name = "BUSINESS_DATE")
	private Date businessDate;
	
	@Column(name = "TNX_ID")
	private String tnxId;
	
	@Column(name = "JOB_ID")
	private String jobId;
	
	@Column(name = "JOB_NAME")
	private String jobName;
	
	@Column(name = "JOB_DESCRIPTION")
	private String jobDescription;
	
	@Column(name = "JOB_CATEGORY")
	private String jobCategory;
	
	@Column(name = "JOB_FREQ")
	private String jobFreq;
	
	@Column(name = "START_DTTM")
	private Date startDttm;
	
	@Column(name = "END_DTTM")
	private Date endDttm;
	
	@Column(name = "JOB_STATUS")
	private String jobStatus;
	
	@Column(name = "JOB_LOG_LOCATION")
	private String jobLogLocation;

	public BatchJobHistory(Job job) {
		this.jobHisId = CustomIdGeneration.generateTxnId(new Date());
		this.entity = "EN1";
		this.businessDate = new Date();
		this.jobId = job.getJobId();
		this.jobName = job.getJobName();
		this.jobDescription = job.getJobDescription();
		this.jobCategory = job.getJobCategory();
		this.jobFreq = job.getJobCategory();
	}

}
