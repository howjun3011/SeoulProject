package com.tech.seoul.health.models;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HealthDao {
    public List<HospitalDto> selectAllHospital();
}
