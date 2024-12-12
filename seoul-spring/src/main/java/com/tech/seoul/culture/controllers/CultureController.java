package com.tech.seoul.culture.controllers;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tech.seoul.culture.models.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tech.seoul.culture.service.CultureService;

@RestController
@RequestMapping("/culture")
public class CultureController {
	@Value("${national.library.key}")
	private String nationalLibraryKey;
	@Value("${national.exhibition.key}")
	private String nationalExhibitionKey;
	@Value("${cultural.space.key}")
	private String culturalSpaceKey;
	@Value("${cultural.movie.key}")
	private String culturalMovieKey;
	@Value("${google.place.key}")
	private String googlePlaceKey;
	@Value("${cultural.performance.key}")
	private String culturalPerformanceKey;

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
	@GetMapping(value = "/getMovieInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CultureMovieInfoDto> selectCultureMovieInfoServiceMain() {return cultureService.selectCultureMovieInfoService();}

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
		// cultureService.insertCultureArtMuseumInfoService(maps);
		// 영화관 정보 입력
		cultureService.insertCultureMovieInfoService(maps);
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

	// 문화재 정보
	@GetMapping(value = "/getCulturalAssetsInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalAssetsInfoMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonService("https://www.khs.go.kr/cha/SearchKindOpenapiList.do?ccbaKdcd="+map.get("sort").toString()+"&ccbaCtcd=11&pageUnit=1000");
	}

	// 문화재 상세 정보
	@GetMapping(value = "/getCulturalAssetsDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalAssetsDetailMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonService("http://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd="+map.get("sort").toString()+"&ccbaCtcd=11&ccbaAsno="+map.get("code").toString());
	}

	// 문화재 행사 정보
	@GetMapping(value = "/getCulturalAssetsEvent", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalAssetsEventMain() throws Exception {
		Calendar now = Calendar.getInstance();

		return cultureService.getXmlToJsonService("https://www.khs.go.kr/cha/openapi/selectEventListOpenapi.do?searchYear="+now.get(Calendar.YEAR)+"&searchMonth="+(now.get(Calendar.MONTH)+1));
	}

	// 문화재 검색
	@GetMapping(value = "/getCulturalAssetsSearch", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalAssetsSearchMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonService("http://www.khs.go.kr/cha/SearchKindOpenapiList.do?ccbaMnm1="+map.get("name").toString()+"&ccbaCtcd=11&pageUnit=50");
	}

	// 공연장 검색
	@GetMapping(value = "/getCulturalSpaceInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getCulturalSpaceInfoMain() throws Exception {
		return cultureService.getXmlToJsonMapService("http://apis.data.go.kr/B553457/nopenapi/rest/cultureartspaces/performingplace?serviceKey="+culturalSpaceKey+"&PageNo=1&numOfrows=1000&gpsxfrom=126.734086&gpsyfrom=37.413294&gpsxto=127.269311&gpsyto=37.715133");
	}

	// 공연장 상세 정보
	@GetMapping(value = "/getCulturalSpaceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getCulturalSpaceDetailMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonMapService("http://apis.data.go.kr/B553457/nopenapi/rest/cultureartspaces/detail?serviceKey="+culturalSpaceKey+"&seq="+map.get("seq").toString());
	}

	// 어제의 박스오피스 정보
	@GetMapping(value = "/getCulturalYesterdayMovieInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getCulturalYesterdayMovieInfoMain(@RequestParam HashMap<String, Object> map) throws Exception {
		Calendar now = Calendar.getInstance();
		return cultureService.getXmlToJsonMapService("http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key="+culturalMovieKey+"&targetDt="+now.get(Calendar.YEAR)+String.format("%02d", now.get(Calendar.MONTH)+1)+String.format("%02d", now.get(Calendar.DATE)-1));
	}

	// 영화 이미지 정보 획득
	@GetMapping(value = "/getCulturalMovieImgInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getCulturalMovieImgInfoMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonMapService("http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key="+culturalMovieKey+"&movieCd="+map.get("id").toString());
	}

	// Google Place API를 활용한 영화관 상세 정보 획득
	@GetMapping(value = "/getCulturalMovieDetailInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> getCulturalMovieDetailInfoMain(@RequestParam String name, @RequestParam String address) throws Exception {
		return cultureService.getCulturalMovieDetailInfoService(name, address, googlePlaceKey);
	}

	// 공연 정보 검색
	@GetMapping(value = "/getCulturalPerformanceInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalPerformanceInfoMain(@RequestParam HashMap<String, Object> map) throws Exception {
		Calendar now = Calendar.getInstance();

		return cultureService.getXmlToJsonService("https://kopis.or.kr/openApi/restful/pblprfr?service="+culturalPerformanceKey+"&stdate=19800101&eddate="+(now.get(Calendar.YEAR)+1)+"1231&cpage=1&rows=50&signgucode=11&shprfnm="+map.get("q").toString());
	}

	// 공연 상세 정보 검색
	@GetMapping(value = "/getCulturalPerformanceDetail", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getCulturalPerformanceDetailMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonService("http://kopis.or.kr/openApi/restful/pblprfr/"+map.get("q").toString()+"?service="+culturalPerformanceKey);
	}

	// 영화 정보 검색
	@GetMapping(value = "/getCulturalMovieSearch", produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getCulturalMovieSearchMain(@RequestParam HashMap<String, Object> map) throws Exception {
		return cultureService.getXmlToJsonMapService("https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key="+culturalMovieKey+"&curPage=1&itemPerPage=50&movieNm="+map.get("q").toString());
	}
}
