package com.tech.seoul.culture.controllers;

import java.util.HashMap;
import java.util.List;

import com.tech.seoul.culture.models.CultureBestsellerDto;
import com.tech.seoul.culture.models.CultureBookDto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.tech.seoul.culture.service.CultureService;

@RestController
@RequestMapping("/culture")
public class CultureController {
	private CultureService cultureService;
	
	public CultureController(CultureService cultureService) {
		this.cultureService = cultureService;
	}

	// DB Select
	@GetMapping(value = "/getBookData", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureBookDto> selectCultureBookMain() {return cultureService.selectCultureBookService();}
	@GetMapping(value = "/getBestsellerData", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureBestsellerDto> selectCultureBestsellerMain() {return cultureService.selectCultureBestsellerService();}
	// DB Insert
	@PostMapping(value = "/insertDB", produces = MediaType.APPLICATION_JSON_VALUE)
	public void insertDBMain(@RequestBody HashMap<String, Object>[] maps) {
		// 서점 정보 입력
		// cultureService.insertCultureBookService(maps);
		// 베스트셀러 정보 입력
		cultureService.insertCultureBestsellerService(maps);
	}
}
