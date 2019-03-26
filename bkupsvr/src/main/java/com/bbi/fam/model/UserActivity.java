package com.bbi.fam.model;

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
@Table(name = "BBI_USER_ACTIVITY")
@NoArgsConstructor
public class UserActivity {
	@Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "ID")
	private Long id;

	@Column(name = "USERNAME")
	private String username;

	@Column(name = "EVENT")
	private String event;

	@Column(name = "DATE")
	@LastModifiedDate
	private Date date;

	public UserActivity(String username, String event, Date date) {
		String[] stringArray = username.split(",,,");
		this.username = stringArray[0];
		this.event = event;
		this.date = date;
	}
	
}
