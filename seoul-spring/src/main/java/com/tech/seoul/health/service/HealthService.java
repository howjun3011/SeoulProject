package com.tech.seoul.health.service;

import com.tech.seoul.health.models.HealthDao;
import com.tech.seoul.health.models.HospitalDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class HealthService {
    @Autowired
    private HealthDao healthDao;

    // test
    public List<HospitalDto> selectAllHospital() {
        return healthDao.selectAllHospital();
    }
}
