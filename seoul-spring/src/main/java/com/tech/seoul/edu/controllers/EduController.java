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
	
	@GetMapping("/eduGardenSearch")
	public List<KindergartenDto> eduGardenSearch(
			HttpServletRequest request){
		return kindergartenService.kindergartenInfo(request);
	}
}
