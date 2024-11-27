package com.tech.seoul.culture.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.tech.seoul.culture.models.CultureDao;

@Service
public class CultureService {
	private CultureDao cultureDao;
	
	public CultureService(CultureDao cultureDao) {
		this.cultureDao = cultureDao;
	}
	
	// Test
	public HashMap<String, Object> selectTestService() {
		HashMap<String, Object> map = new HashMap<>();
		map.put("test", cultureDao.selectTest());
		return map;
	}
}
