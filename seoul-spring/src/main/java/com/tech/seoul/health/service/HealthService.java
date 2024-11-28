package com.tech.seoul.health.service;

import com.tech.seoul.health.models.HealthDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class HealthService {
    @Autowired
    private HealthDao healthDao;

    // test
    public HashMap<String, Object> selectTestService() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("test", healthDao.selectTest());

        return map;
    }
}
