package com.bbi.fam.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "HOLIDAY")
@Getter
@Setter
public class Holiday {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "HOLIDAY_ID")
	private Long id;

	@Column(name = "DATE")
	private String date;
	
	@Column(name = "EVENT")
	private String event;
	
	@Column(name = "YEAR")
	private String year;
	
	@Transient
	private boolean isPast;
}
