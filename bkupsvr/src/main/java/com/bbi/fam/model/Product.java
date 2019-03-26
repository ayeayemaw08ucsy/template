package com.bbi.fam.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.validator.constraints.Length;

import com.bbi.fam.utils.StringPrefixedSequenceIdGenerator;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PRODUCT")
@Getter
@Setter
@NoArgsConstructor 
public class Product implements Serializable {

	private static final long serialVersionUID = -788207637359711534L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PRODUCT_SEQ")
	@GenericGenerator(name = "PRODUCT_SEQ", strategy = "com.bbi.fam.utils.StringPrefixedSequenceIdGenerator", parameters = {
			@Parameter(name = StringPrefixedSequenceIdGenerator.INCREMENT_PARAM, value = "50")})
	@Column(name = "ID")
	@Length(max = 50)
	private String id;

	@Column(name = "NAME")
	private String name;
	
	@Column(name = "PREFIX")
	private String prefix;
	
}
