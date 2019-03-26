package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BBI_BATCH_JOB_MST")
@Getter
@Setter
@NoArgsConstructor
public class Job {

	@Id
	@Column(name = "JOB_ID"  , columnDefinition="VARCHAR(50)", updatable=false ,nullable = false)
	private String jobId;

	@Column(name = "JOB_NAME")
	private String jobName;

	@Column(name = "JOB_CATEGORY")
	private String jobCategory;

	@Column(name = "JOB_FREQ")
	private String jobFreq;

	@Column(name = "JOB_START_TIME")
	private String jobStarttime;

	@Column(name = "JOB_RERUN_CODE")
	private String jobRerunCode;

	@Column(name = "JOB_DESCRIPTION")
	private String jobDescription;

	@Column(name = "JOB_LOCATION")
	private String jobLocation;

	@Column(name = "JOB_UPDATE_DATE")
	private Date jobUpdateDate;

	@Column(name = "ACTIVE_STATUS")
	private String activeStatus;

	@Column(name = "NEXT_JOB_ID")
	private String nextJobId;

	@Column(name = "NEXT_JOB_NAME")
	private String nextJobName;

}
