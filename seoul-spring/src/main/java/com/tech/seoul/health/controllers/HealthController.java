package com.tech.seoul.health.controllers;

import com.tech.seoul.health.models.HospitalDto;
import com.tech.seoul.health.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/health")
public class HealthController {
    @Autowired
    private HealthService healthService;

    @GetMapping(value="/search")
    public List<HospitalDto> searchHospitals(@RequestParam(required = false) Double lat,
                                             @RequestParam(required = false) Double lon,
                                             @RequestParam(required = false) Double radius,
                                             @RequestParam(required = false) String keyword) {

        if(lat != null && lon != null && radius != null) {
            // 위치 기반 검색
            return healthService.searchHospitalsByLocationAndKeyword(lat, lon, radius, keyword);
        } else {
            // 키워드 기반 전체 검색
            return healthService.searchHospitalsByKeyword(keyword);
        }
    }
}
