package com.tech.seoul.health.models;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HealthDao {
    public List<HospitalDto> findHospitalWithRadius(@Param("lat") double lat, @Param("lon") double lon, @Param("radius") double radius, @Param("keyword") String keyword, @Param("subject") String subject, @Param("week") String week);
    public List<HospitalDto> findByKeyword(@Param("keyword") String keyword, @Param("subject") String subject, @Param("week") String week);
}
