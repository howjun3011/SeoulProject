package com.tech.seoul.edu.models;

import java.util.List;

import com.tech.seoul.edu.util.EduSearchVO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PageInfoDto<T> {
	private List<T> items;
	private int total;
	private EduSearchVO searchVO;
}
