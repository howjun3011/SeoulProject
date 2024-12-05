package com.tech.seoul.culture.controllers;

import java.util.HashMap;
import java.util.List;

import com.tech.seoul.culture.models.CultureBestsellerDto;
import com.tech.seoul.culture.models.CultureBookDto;
import com.tech.seoul.culture.models.CultureBookLibraryDto;
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
	@GetMapping(value = "/getBookLibrary", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureBookLibraryDto> selectCultureBookLibraryMain() {return cultureService.selectCultureBookLibraryService();}

	// DB Insert
	@PostMapping(value = "/insertDB", produces = MediaType.APPLICATION_JSON_VALUE)
	public void insertDBMain(@RequestBody HashMap<String, Object>[] maps) {
		// 서점 정보 입력
		// cultureService.insertCultureBookService(maps);
		// 베스트셀러 정보 입력
		// cultureService.insertCultureBestsellerService(maps);
		// 도서관 정보 입력
		cultureService.insertCultureBookLibraryService(maps);
	}

	// 국립중앙도서관 사서추천도서
	@GetMapping("/getNationalLibrary")
	public String getNationalLibraryMain() throws Exception {
		return cultureService.getNationalLibraryService("https://nl.go.kr/NL/search/openApi/saseoApi.do?key=");
	}

	// 국립중앙도서관 소장자료 검색 기능
	@GetMapping(value = "/getNationalLibrarySearch", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getNationalLibrarySearchMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getNationalLibraryService("https://www.nl.go.kr/NL/search/openApi/search.do?kwd="+map.get("kwd").toString()+"&pageSize=50&key=");
	}
}
