package com.tech.seoul.edu.models;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EduDao {
	public List<KindergartenDto> KindergartenNormal(
			@Param("swLat") String swLat,
			@Param("swLng") String swLng,
			@Param("neLat") String neLat,
			@Param("neLng") String neLng);
}
