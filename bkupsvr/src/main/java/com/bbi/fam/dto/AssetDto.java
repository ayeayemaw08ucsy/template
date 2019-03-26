package com.bbi.fam.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class AssetDto {
	private BigDecimal data;
	private String label;
	public AssetDto(BigDecimal data, String label) {
		this.data = data;
		this.label = label;
	}
}
