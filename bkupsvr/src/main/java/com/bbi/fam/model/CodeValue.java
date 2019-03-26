package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bbi_code_val_mst")
@Getter
@Setter
public class CodeValue implements Serializable{
	@Id
	@Column(name = "code_val_mst_seq_id", columnDefinition="VARCHAR(50) NOT NULL", updatable=false ,nullable = false)
	private String id;
    
	@Column(name="parent_type", columnDefinition ="VARCHAR(10)")
	private String parentType;
	//@Column(name = "code_val" , columnDefinition ="VARCHAR(10) NOT NULL UNIQUE")
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
	
	@Transient
	private boolean check;
	
	@Override
	public String toString() {
		return "CodeValue [id=" + id + ", parentType=" + parentType + ", codeValue=" + codeValue + ", shortDesc="
				+ shortDesc + ", longDesc=" + longDesc + ", businessDate=" + businessDate + ", codeValUpdateFlag="
				+ codeValUpdateFlag + ", code=" + code + ", getId()=" + getId() + ", getParentType()=" + getParentType()
				+ ", getCodeValue()=" + getCodeValue() + ", getShortDesc()=" + getShortDesc() + ", getLongDesc()="
				+ getLongDesc() + ", getBusinessDate()=" + getBusinessDate() + ", getCodeValUpdateFlag()="
				+ getCodeValUpdateFlag() + ", getCode()=" + getCode() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + ", toString()=" + super.toString() + "]";
	}
	
}
