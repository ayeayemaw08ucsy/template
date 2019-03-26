package com.bbi.fam.helper;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class AccountHelperImpl implements AccountHelper {

	@Override
	public UserDetails getLoginUser() {
		try {
			Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (principal instanceof UserDetails) {
				return ((UserDetails) principal);
			} else {
				return null;
			}
		} catch (NullPointerException e) {
			return null;
		}
	}
}
