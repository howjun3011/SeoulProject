package com.tech.seoul.edu.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.seoul.edu.models.KindergartenDto;
import com.tech.seoul.edu.service.KindergartenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/education")
@RequiredArgsConstructor
public class EduController {
	
	private KindergartenService kindergartenService;
	
	
	@RequestMapping("/eduTest")
	public List<KindergartenDto> eduTest() {
		
		
		
		return kindergartenService.kindergartenInfo();
	}
}
