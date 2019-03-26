package com.bbi.fam.utils;

import java.util.Calendar;
import java.util.Date;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class CustomIdGeneration {

	public static String generateTxnId(Date date) {
		DateTime dateTime = new DateTime(date);
		DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss.SSS");
		String dtStr = dtf.print(dateTime);
		DateTime jodatime = dtf.parseDateTime(dtStr);
		DateTimeFormatter dtfOut = DateTimeFormat.forPattern("yyMM");
		String txnId = dtfOut.print(jodatime) + jodatime.getMillis(); 
		return txnId;
	}
	
	public static Date convertMilliSecToDate(long milliSec) {
		DateTime date = new DateTime(milliSec);
		Date javaDate = date.toDate();
		System.out.println(javaDate);
		return javaDate; 
	}
	
	/*public static void main(String[] args) {
		generateTxnId(new Date());
		convertMilliSecToDate(1545807397463L);
	}*/
	
	public static final String generateProductId(String branchCode, Date d, String accessTypeCode) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(d);
		int year = cal.get(Calendar.YEAR);
		
		String productId = branchCode + accessTypeCode + String.valueOf(year).substring(2) ;
		return productId;
	}
}
