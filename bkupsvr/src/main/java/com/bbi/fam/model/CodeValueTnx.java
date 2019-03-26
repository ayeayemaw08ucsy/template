package com.bbi.fam.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Table(name = "bbi_code_val_tnx")
@Getter
@Setter
public class CodeValueTnx {
	@Id
	@Column(name = "code_val_tnx_seq_id", columnDefinition="VARCHAR(50) NOT NULL", updatable=false ,nullable = false)
	private String codeValueTnxSeqId;
    
	@Column(name="parent_type", columnDefinition ="VARCHAR(10)")
	private String parentType;
	
	@Column(name = "code_val" , columnDefinition ="VARCHAR(10) NOT NULL")
	private String codeValue;
	
	@Column(name = "short_desc", columnDefinition = "VARCHAR(25)")
	private String shortDesc;
	
	@Column(name= "long_desc", columnDefinition = "VARCHAR(80)")
	private String longDesc;
	
	@Column(name="business_date")
	private Date businessDate;

	@Column(name="code_val_update_flag", columnDefinition = "VARCHAR(1)")
	private String codeValUpdateFlag;
	
	@ManyToOne(cascade= CascadeType.ALL)
    @JoinColumn(name = "code_id")
    private Code code;
	
	@Column(name = "tnx_status_code" , columnDefinition="VARCHAR(15)")
	private String tnxStatusCode;
		
	@Column(name = "tnx_type" , columnDefinition="VARCHAR(3)")
	private String tnxType;
		
	@Column(name = "tnx_sub_type" , columnDefinition="VARCHAR(3)")
	private String tnxSubType;
		
	@Column(name = "inp_user" , columnDefinition="VARCHAR(50)")
	private String inputUserId;
		
	@Column(name = "appr_user" , columnDefinition="VARCHAR(50)")
	private String approveUserId;
		
	@Column(name = "inp_dttm")
	private Date inputDateTime;
		
	@Column(name = "app_dttm" )
	private Date approveDateTime;
		
		
	@ManyToOne(cascade= CascadeType.ALL,fetch = FetchType.LAZY)
	@JoinColumn(columnDefinition="VARCHAR(50)  DEFAULT NULL",name="code_val_mst_seq_id")
	private CodeValue codeValueMst;
		
	@Column(name = "TASK_ID",columnDefinition="VARCHAR(50)")
	private String taskId;

}
