package com.tech.seoul.culture.controllers;

import java.util.HashMap;
import java.util.List;

import com.tech.seoul.culture.models.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.tech.seoul.culture.service.CultureService;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/culture")
public class CultureController {
	@Value("${national.library.key}")
	private String nationalLibraryKey;
	@Value("${national.exhibition.key}")
	private String nationalExhibitionKey;

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
	@GetMapping(value = "/getMuseumInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureMuseumInfoDto> selectCultureMuseumInfoMain() {return cultureService.selectCultureMuseumInfoService();}
	@GetMapping(value = "/getArtMuseumInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureArtMuseumInfoDto> selectCultureArtMuseumInfoMain() {return cultureService.selectCultureArtMuseumInfoService();}

	// DB Insert
	@PostMapping(value = "/insertDB", produces = MediaType.APPLICATION_JSON_VALUE)
	public void insertDBMain(@RequestBody HashMap<String, Object>[] maps) {
		// 서점 정보 입력
		// cultureService.insertCultureBookService(maps);
		// 베스트셀러 정보 입력
		// cultureService.insertCultureBestsellerService(maps);
		// 도서관 정보 입력
		// cultureService.insertCultureBookLibraryService(maps);
		// 박물관 정보 입력
		// cultureService.insertCultureMuseumInfoService(maps);
		// 박물관 정보 입력
		cultureService.insertCultureArtMuseumInfoService(maps);
	}

	// 국립중앙도서관 사서추천도서
	@GetMapping("/getNationalLibrary")
	public String getNationalLibraryMain() throws Exception {
		int year = (int)(Math.random() * 4);
		int[] sornNum = new int[] {11, 6, 5, 4};

		return cultureService.getXmlToJsonService("https://nl.go.kr/NL/search/openApi/saseoApi.do?start_date=202"+year+"0101&end_date=20241130&drCode="+sornNum[(int)(Math.random() * 3)]+"&key="+nationalLibraryKey);
	}

	// 국립중앙도서관 소장자료 검색 기능
	@GetMapping(value = "/getNationalLibrarySearch", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getNationalLibrarySearchMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonService("https://www.nl.go.kr/NL/search/openApi/search.do?kwd="+map.get("kwd").toString()+"&pageSize=50&key="+nationalLibraryKey);
	}

	// 공공기관 전시정보
	@GetMapping(value = "/getExhibitionInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getExhibitionInfoMain() throws Exception {
		return cultureService.getXmlToJsonService("http://api.kcisa.kr/openapi/API_CCA_145/request?serviceKey="+nationalExhibitionKey+"&numOfRows=400&pageNo=1");
	}
}
