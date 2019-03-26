package com.bbi.fam.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bbi.fam.dao.HolidayRepository;
import com.bbi.fam.dao.WeeklyPolicyRepository;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Holiday;
import com.bbi.fam.model.WeeklyPolicy;
import com.bbi.fam.service.HolidayService;
import com.bbi.fam.utils.BusinessDateCalc;
import com.bbi.fam.utils.Common;

@Service(value = "holidayService")
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	private HolidayRepository holidayRepo;

	@Autowired
	private WeeklyPolicyRepository policyRepo;
	
	@Value("${spring.error.duplicateerror.duplicateday}")
	private String duplicate;

	public List<Holiday> findAll() {
		List<Holiday> list = new ArrayList<>();
		List<Holiday> holidayList = new ArrayList<>();
		holidayRepo.findAllSorted().iterator().forEachRemaining(list::add);
		for (Holiday holi : list) {
			holi.setPast(Common.isPast(holi.getDate()));
			holidayList.add(holi);
		}
		return holidayList;
	}

	@Override
	public Holiday findOne(long id) {
		return holidayRepo.findById(id).get();
	}

	@Override
	public void delete(long id) {
		holidayRepo.deleteById(id);
	}

	@Override
	@Transactional("transactionManager")
	public Holiday save(Holiday holiday) throws FamApplicationException {
		String date = Common.dateSubString(holiday.getDate());
		if (holiday.getId() == null) {
			List<Holiday> holidayList = holidayRepo.findByDate(date);
			if (holidayList.size() != 0) {
				throw new FamApplicationException(duplicate + date);
			}
		} else {
			Holiday hol = holidayRepo.findById(holiday.getId()).get();
			if (!hol.getDate().equalsIgnoreCase(date)) {
				List<Holiday> holidayList = holidayRepo.findByDate(date);
				if (holidayList.size() != 0) {
					throw new FamApplicationException(duplicate + date);
				}
			}
		}

		holiday.setDate(date);
		holiday.setYear(holiday.getDate().substring(0, 4));
		return holidayRepo.save(holiday);
	}

	@Override
	public List<String> findByYear() {
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int year = cal.get(Calendar.YEAR);
		List<LocalDate> dateList = new ArrayList<LocalDate>();
		List<Holiday> holidayList = holidayRepo.findByYear(String.valueOf(year));
		DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd");
		for (Holiday holiday : holidayList) {
			LocalDate localDate = LocalDate.parse(holiday.getDate(), dtf);
			dateList.add(localDate);
		}
		WeeklyPolicy policy = policyRepo.findById("weeklypolicy_id").get();
		return BusinessDateCalc.getDateList(year, 1, 1, year, 12, 31, dateList, policy);
	}
}
