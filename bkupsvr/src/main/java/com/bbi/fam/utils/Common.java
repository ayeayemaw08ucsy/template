package com.bbi.fam.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class Common {
	
	public static final String[] TNX_STATUS_CODE = {"01","02","03"};
	
	public static final String[]  TNX_TYPE = {"10","20","30","40","50","60","70","80","90"};
	
	public static final String[] TNX_SUB_TYPE = {"11","12","21","22","31","32","41","42","43"};
	
	public static final String[] PRODUCT_STATUS_CODE = {"01","02","03"};
	
	public static String dateSubString(String date) {
		if(date.length() == 10) {
			return date;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
		Date newDate = new Date();
		String dateString = null;
		try {
			newDate = sdf.parse(date);
			SimpleDateFormat dt1 = new SimpleDateFormat("yyyyy-MM-dd");
			dateString = dt1.format(newDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return dateString.substring(1, dateString.length());
	}
	
	/*public static void main(String[] args) {
		System.out.println(dateSubString("2018-12-31T17:30:00.000Z"));
	}*/
	
	public static boolean isPast (String date) {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
		Date newDate = new Date();
		try {
			newDate = format.parse(date);
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (newDate.getTime() < new Date().getTime()) {
			return true;
		} else {
			return false;
		}
		
	}
	
}
