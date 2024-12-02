package com.tech.seoul.edu.models;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EduDao {
	public List<KindergartenDto> KindergartenNormal();
}
