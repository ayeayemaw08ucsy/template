package com.bbi.fam.utils;

import java.util.ArrayList;
import java.util.List;

import org.joda.time.Days;
import org.joda.time.DurationFieldType;
import org.joda.time.LocalDate;

import com.bbi.fam.model.WeeklyPolicy;

public class BusinessDateCalc {
	public static List<String> getDateList(int startYear, int startMonth, int startDay, int endYear, int endMonth,
			int endDay, List<LocalDate> holidayDates, WeeklyPolicy policy) {

		List<Integer> dayNumbers = new ArrayList<>();
		if (!policy.isMonday()) {
			dayNumbers.add(1);
		}
		if (!policy.isTuesday()) {
			dayNumbers.add(2);
		}
		if (!policy.isWednesday()) {
			dayNumbers.add(3);
		}
		if (!policy.isThursday()) {
			dayNumbers.add(4);
		}
		if (!policy.isFriday()) {
			dayNumbers.add(5);
		}
		if (!policy.isSaturday()) {
			dayNumbers.add(6);
		}
		if (!policy.isSunday()) {
			dayNumbers.add(7);
		}

		LocalDate startDate = new LocalDate(startYear, startMonth, startDay);
		LocalDate endDate = new LocalDate(endYear, endMonth, endDay);

		List<LocalDate> dates = new ArrayList<LocalDate>();
		List<String> dateStringList = new ArrayList<String>();

		int days = Days.daysBetween(startDate, endDate).getDays() + 1;
		for (int i = 0; i < days; i++) {
			LocalDate d = startDate.withFieldAdded(DurationFieldType.days(), i);
			if (!dayNumbers.contains(d.getDayOfWeek())) {
				dates.add(d);
			}
		}

		for (LocalDate holiday : holidayDates) {
			if (dates.contains(holiday)) {
				dates.remove(holiday);
			}
		}

		for (LocalDate date : dates) {
			dateStringList.add(date.toString());
		}

		return dateStringList;
	}
}
