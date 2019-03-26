package com.bbi.fam.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bbi_code_id")
@Getter
@Setter
public class Code implements Serializable{
	@Id
	@Column(name = "code_id" , columnDefinition="VARCHAR(3) NOT NULL", updatable=false ,nullable = false)
	private String id;
	
	@Column(name= "code_id_desc", columnDefinition="VARCHAR(50)")
	private String codeIdDesc;
	
	@Column(name="code_val_length" , length=3)
	private Integer codeValLen;
	
	@Column(name="created_date", columnDefinition="TIMESTAMP  DEFAULT CURRENT_TIMESTAMP" )
	//@Column(name="createdDate")
	private Date createdDate;

	@Override
	public String toString() {
		return "Code [id=" + id + ", codeIdDesc=" + codeIdDesc + ", codeValLen=" + codeValLen + ", createdDate="
				+ createdDate + ", getId()=" + getId() + ", getCodeIdDesc()=" + getCodeIdDesc() + ", getCodeValLen()="
				+ getCodeValLen() + ", getCreatedDate()=" + getCreatedDate() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}
	
	/*@OneToMany(fetch = FetchType.EAGER,mappedBy="code",cascade = CascadeType.ALL)
    private Set<CodeValue> codeValueList;*/

	
	
	
	
}
