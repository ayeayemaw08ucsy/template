package com.bbi.fam.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WorkingDay {

	private String previous;
	
	private String current;
	
	private String next;
}
