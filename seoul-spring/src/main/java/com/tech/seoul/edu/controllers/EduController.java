package com.tech.seoul.edu.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.seoul.edu.models.KidsLocalCenterDetailDto;
import com.tech.seoul.edu.models.KidsLocalCenterNameDto;
import com.tech.seoul.edu.models.KinderDetailInfoDto;
import com.tech.seoul.edu.models.KindergartenNameDto;
import com.tech.seoul.edu.models.PageInfoDto;
import com.tech.seoul.edu.service.KinderInfoService;
import com.tech.seoul.edu.service.KindergartenService;
import com.tech.seoul.edu.service.LocalCenterInfoService;
import com.tech.seoul.edu.service.LocalCenterService;
import com.tech.seoul.edu.util.EduSearchVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/education")
@RequiredArgsConstructor
public class EduController {
	
	private final KindergartenService kindergartenService;
	private final KinderInfoService kinderInfoService;
	private final LocalCenterService localCenterService;
	private final LocalCenterInfoService localCenterInfoService;
	
	@GetMapping("/eduGardenSearch")
	public PageInfoDto<KindergartenNameDto> eduGardenSearch(
			HttpServletRequest request,
			EduSearchVO searchVO){
		return kindergartenService.kindergartenInfo(request,searchVO);
	}
	@GetMapping("/eduLocalCenterSearch")
	public PageInfoDto<KidsLocalCenterNameDto> eduLocalCenterSearch(
			HttpServletRequest request,
			EduSearchVO searchVO){
		return localCenterService.LocalCenterInfo(request,searchVO);
	}
	
	
	@GetMapping("/eduKinderInfo")
	public KinderDetailInfoDto eduKinderInfo(
			HttpServletRequest request){
		return kinderInfoService.DetailInfo(request);
	}
	@GetMapping("/eduLocalCenterInfo")
	public KidsLocalCenterDetailDto eduLocalCenterInfo(
			HttpServletRequest request){
		return localCenterInfoService.DetailInfo(request);
	}
	
	
}
