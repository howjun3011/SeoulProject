package com.tech.seoul.health.controllers;

import com.tech.seoul.health.models.HospitalDto;
import com.tech.seoul.health.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/health")
public class HealthController {
    @Autowired
    private HealthService healthService;

    // test
    @GetMapping(value="/getAllHospitalInfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<HospitalDto> selectAllHospital() {
        return healthService.selectAllHospital();
    }

}
