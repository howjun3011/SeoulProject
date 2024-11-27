package com.tech.seoul.culture.models;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CultureDao {
	public String selectTest();
}
