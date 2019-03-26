package com.bbi.fam.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bbi.fam.dto.WorkingDay;
import com.bbi.fam.exception.ApiError;
import com.bbi.fam.exception.FamApplicationException;
import com.bbi.fam.model.Holiday;
import com.bbi.fam.service.HolidayService;

@RestController
@RequestMapping("/holidays")
public class HolidayController {

	@Autowired
	private HolidayService holidayService;

	// @PreAuthorize("hasRole('ROLE_1')")
	@RequestMapping(value = "/holiday", method = RequestMethod.GET)
	public ResponseEntity<List<Holiday>> listHoliday() {
		return new ResponseEntity<List<Holiday>>(holidayService.findAll(), HttpStatus.OK);
	}

	@RequestMapping(value = "/business-date", method = RequestMethod.GET)
	public ResponseEntity<List<String>> listBusinessDate() {
		return new ResponseEntity<List<String>>(holidayService.findByYear(), HttpStatus.OK);
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/holiday", method = RequestMethod.POST)
	public ResponseEntity<Object> create(@RequestBody Holiday holiday) {
		try {
			return new ResponseEntity<Object>(holidayService.save(holiday), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}

	// @PreAuthorize("hasRole('ROLE_3')")
	@RequestMapping(value = "/holiday/{id}", method = RequestMethod.GET)
	public ResponseEntity<Holiday> findOne(@PathVariable long id) {
		return new ResponseEntity<Holiday>(holidayService.findOne(id), HttpStatus.OK);
	}

	@RequestMapping(value = "/holiday/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Object> update(@PathVariable long id, @RequestBody Holiday holiday) {
		holiday.setId(id);
		try {
			return new ResponseEntity<Object>(holidayService.save(holiday), HttpStatus.OK);
		} catch (FamApplicationException ex) {
			String error = ex.getMessage();
			ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, error, ex.getLocalizedMessage());
			return new ResponseEntity<Object>(apiError, apiError.getStatus());
		}
	}

	@RequestMapping(value = "/holiday/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable(value = "id") Long id) {
		holidayService.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/working-day", method = RequestMethod.GET)
	public ResponseEntity<WorkingDay> getWorkingDay() {
		List<String> businessDateList = holidayService.findByYear();

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Date today = Calendar.getInstance().getTime();
		String currentDate = df.format(today);
		WorkingDay day = new WorkingDay();
		for (String s : businessDateList) {
			if (s.equalsIgnoreCase(currentDate)) {
				day.setCurrent(s);
				int idx = businessDateList.indexOf(s);
				day.setNext(businessDateList.get(idx + 1));
				day.setPrevious(businessDateList.get(idx - 1));
			}
		}
		while (day.getNext() == null) {
			Calendar c = Calendar.getInstance();
			c.setTime(today);
			c.add(Calendar.DATE, 1);
			for (String s : businessDateList) {
				today = c.getTime();
				String tempDate = df.format(today);

				if (s.equalsIgnoreCase(tempDate)) {
					int idx = businessDateList.indexOf(s);
					day.setNext(businessDateList.get(idx));
					day.setPrevious(businessDateList.get(idx - 1));
				}
			}
		}
		return new ResponseEntity<WorkingDay>(day, HttpStatus.OK);
	}

}
