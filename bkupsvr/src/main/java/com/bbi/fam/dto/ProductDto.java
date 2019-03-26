package com.bbi.fam.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDto {

	private String id;
	private String code;
	private String name;
	private String prefix;

	public ProductDto(String id, String code, String name, String prefix) {
		this.id = id;
		this.name = name;
		this.prefix = prefix;
		this.code = code;
	}

}
