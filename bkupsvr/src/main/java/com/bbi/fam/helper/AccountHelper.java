package com.bbi.fam.helper;

import org.springframework.security.core.userdetails.UserDetails;

public interface AccountHelper {

	UserDetails getLoginUser();
}
