package com.bbi.fam.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.bbi.fam.dto.CodeValueString;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author pyaephyo.aung
 *
 */
@Entity
@Getter
@Setter
@Table(name = "USERS")
@NoArgsConstructor
public class User implements Serializable, UserDetails {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ID")
	private long id;

	@Column(name = "FIRSTNAME")
	private String firstName;

	@Column(name = "LASTNAME")
	private String lastName;

	@Column(name = "USERNAME")
	private String username;

	@Column(name = "PASSWORD")
	private String password;

	@Column(name = "ENTITY")
	private String entity;

	@Column(name = "EMAIL")
	private String email;

	@Column(name = "PHONE")
	private String phone;
	
	@Column(name = "MOBILE",columnDefinition="VARCHAR(50)")
	private String mobile;

	@Column(name = "GENDER")
	private String gender;

	@Column(name = "BRANCH_CODE")
	private String branchCode;

	@Column(name = "GROUP_CODE")
	private String groupCode;

	@Column(name = "DEPT_CODE")
	private String deptCode;
	
	@Column(name = "LEVEL_CODE")
	private String levelCode;

	@Column(name = "USER_ROLE")
	private String userRole;

	@Column(name = "PWD_EXPIRY_DATE")
	private Date pwdExpiryDate;
	
	@Column(name = "LAST_LOGIN_FAIL")
	private Date lastLoginFail;

	@Column(name = "BUSINESS_DATE")
	private Date businessDate;

	@Column(name = "ENABLED", columnDefinition = "tinyint(1) default 1")
	private boolean enabled;

	@Column(name = "ACCOUNTNONEXPIRED", columnDefinition = "tinyint(1) default 1")
	private boolean accountNonExpired;

	@Column(name = "ACCOUNTNONLOCKED", columnDefinition = "tinyint(1) default 1")
	private boolean accountNonLocked;

	@Column(name = "CREDENTIALSNONEXPIRED", columnDefinition = "tinyint(1) default 1")
	private boolean credentialsNonExpired;

	@Transient
	private List<UserFunction> valueList;
	
	@Transient
	private CodeValueString codeValueList;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<SimpleGrantedAuthority> userRoles = new HashSet<SimpleGrantedAuthority>();
		for (UserFunction value : valueList) {
			SimpleGrantedAuthority authority = new SimpleGrantedAuthority(value.getCode());
			userRoles.add(authority);
		}
		return userRoles;
	}

	public User(long id, String firstName, String lastName, String username, String password, String entity,
			String email, String phone, String gender, String branchCode, String deptCode, String levelCode, String userRole,
			Date pwdExpiryDate, Date businessDate, boolean enabled, boolean accountNonExpired, boolean accountNonLocked,
			boolean credentialsNonExpired, List<UserFunction> valueList) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
		this.entity = entity;
		this.email = email;
		this.phone = phone;
		this.gender = gender;
		this.branchCode = branchCode;
		this.deptCode = deptCode;
		this.userRole = userRole;
		this.pwdExpiryDate = pwdExpiryDate;
		this.businessDate = businessDate;
		this.levelCode = levelCode;
		this.enabled = enabled;
		this.accountNonExpired = accountNonExpired;
		this.accountNonLocked = accountNonLocked;
		this.credentialsNonExpired = credentialsNonExpired;
		this.valueList = valueList;
	}

}
