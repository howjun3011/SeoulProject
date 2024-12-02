package com.tech.seoul.culture.models;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CultureDao {
	public Integer selectCultureBookPKCnt(String esntl_id);
	public List<CultureBookDto> selectCultureBook();
	public void insertCultureBook(CultureBookDto cultureBookDto);
}
