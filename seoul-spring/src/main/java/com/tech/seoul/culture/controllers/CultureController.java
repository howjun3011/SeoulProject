package com.tech.seoul.culture.controllers;

import java.util.HashMap;
import java.util.List;

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

	@GetMapping(value = "/getBookData", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureBookDto> selectCultureBookMain() {return cultureService.selectCultureBookService();}
	// DB Insert
	@PostMapping(value = "/insertDB", produces = MediaType.APPLICATION_JSON_VALUE)
	public void insertDBMain(@RequestBody HashMap<String, Object>[] maps) {
		cultureService.insertCultureBookService(maps);
	}
}
