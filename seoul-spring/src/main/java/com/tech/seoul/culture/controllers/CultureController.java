package com.tech.seoul.culture.controllers;

import java.util.HashMap;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.seoul.culture.service.CultureService;

@RestController
@RequestMapping("/culture")
public class CultureController {
	private CultureService cultureService;
	
	public CultureController(CultureService cultureService) {
		this.cultureService = cultureService;
	}
	
	// Test
	@GetMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
	public HashMap<String, Object> selectTestCulture() {
		return cultureService.selectTestService();
	}
}
