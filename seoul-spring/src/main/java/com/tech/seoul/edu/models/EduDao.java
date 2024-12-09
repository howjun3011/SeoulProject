package com.tech.seoul.edu.models;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EduDao {
	public int KindergartenNameCnt(
			@Param("query") String query,
			@Param("areas") String[] areas );
	public List<KindergartenNameDto> KindergartenName(
			@Param("query") String query,
			@Param("areas") String[] areas,
			@Param("start") int start,
			@Param("end") int end);
	public KinderDetailInfoDto selectKinderInfo(
			@Param("kindergarten_name") String kindergarten_name,
			@Param("address") String address);
	
}
