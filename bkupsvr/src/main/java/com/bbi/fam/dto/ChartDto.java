package com.bbi.fam.dto;

import java.util.List;

import lombok.Data;

@Data
public class ChartDto {
	private List<Object> data;
	private String label;

}
