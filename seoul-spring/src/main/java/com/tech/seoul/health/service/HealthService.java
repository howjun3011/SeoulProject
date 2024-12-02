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

    public List<HospitalDto> searchHospitalsByLocationAndKeyword(double lat, double lon, double radius, String keyword) {
        return healthDao.findHospitalWithRadius(lat, lon, radius, keyword);
    }

    public List<HospitalDto> searchHospitalsByKeyword(String keyword) {
        return healthDao.findByKeyword(keyword);
    }
}
