package com.tech.seoul.health.models;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface HealthDao {
    public String selectTest();
}
