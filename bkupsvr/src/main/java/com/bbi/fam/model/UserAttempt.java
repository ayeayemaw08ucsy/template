package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.annotation.LastModifiedDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "USER_ATTEMPT")
@NoArgsConstructor
public class UserAttempt implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "ID")
	private Long id;

	@Column(name = "USERNAME")
	private String username;

	@Column(name = "ATTEMPT")
	private int attempt;

	@Column(name = "LAST_MODIFIED")
	@LastModifiedDate
	private Date lastModified;

	public UserAttempt(Long id, String username, int attempt, Date lastModified) {
		this.id = id;
		this.username = username;
		this.attempt = attempt;
		this.lastModified = lastModified;
	}
}
