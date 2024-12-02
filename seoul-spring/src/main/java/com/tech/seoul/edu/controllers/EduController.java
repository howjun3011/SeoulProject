package com.tech.seoul.edu.controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.seoul.edu.models.KindergartenDto;
import com.tech.seoul.edu.service.KindergartenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/education")
@RequiredArgsConstructor
public class EduController {
	
	private final KindergartenService kindergartenService;
	
	
	@GetMapping("/eduTest")
	public List<KindergartenDto> eduTest(
			HttpServletRequest request) {
		System.out.println("swLat :" + request.getParameter("swLat"));
		System.out.println("swLng :" + request.getParameter("swLng"));
		System.out.println("neLat :" + request.getParameter("neLat"));
		System.out.println("neLng :" + request.getParameter("neLng"));
		return kindergartenService.kindergartenInfo(request);
	}
}
