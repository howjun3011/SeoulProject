package com.tech.seoul.culture.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.tech.seoul.culture.models.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

@Service
public class CultureService {
	private CultureDao cultureDao;
	
	public CultureService(CultureDao cultureDao) {
		this.cultureDao = cultureDao;
	}


	// DB 정보 획득
	public List<CultureBookDto> selectCultureBookService() {return cultureDao.selectCultureBook();}
	public List<CultureBestsellerDto> selectCultureBestsellerService() {return cultureDao.selectCultureBestseller();}
	public List<CultureBookLibraryDto> selectCultureBookLibraryService() {return cultureDao.selectCultureBookLibrary();}
	public List<CultureMuseumInfoDto> selectCultureMuseumInfoService() {return cultureDao.selectCultureMuseumInfo();}
	public List<CultureArtMuseumInfoDto> selectCultureArtMuseumInfoService() {return cultureDao.selectCultureArtMuseumInfo();}
	public List<CultureMovieInfoDto> selectCultureMovieInfoService() {return cultureDao.selectCultureMovieInfo();}


	// DB Insert
	public void insertCultureBookService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureBookPKCnt(map.get("ESNTL_ID").toString());

			if (cnt == 0 && map.get("FCLTY_ROAD_NM_ADDR").toString().contains("서울")) {
				CultureBookDto cultureBookDto = new CultureBookDto();

				cultureBookDto.setEsntl_id(map.get("ESNTL_ID").toString());
				cultureBookDto.setFclty_nm(map.get("FCLTY_NM").toString());
				cultureBookDto.setLclas_nm(map.get("LCLAS_NM").toString());
				cultureBookDto.setMlsfc_nm(map.get("MLSFC_NM").toString());
				cultureBookDto.setZip_no(map.get("ZIP_NO").toString());
				cultureBookDto.setFclty_road_nm_addr(map.get("FCLTY_ROAD_NM_ADDR").toString());
				cultureBookDto.setFclty_la(map.get("FCLTY_LA").toString());
				cultureBookDto.setFclty_lo(map.get("FCLTY_LO").toString());
				cultureBookDto.setWorkday_opn_bsns_time(map.get("WORKDAY_OPN_BSNS_TIME").toString());
				cultureBookDto.setWorkday_clos_time(map.get("WORKDAY_CLOS_TIME").toString());
				cultureBookDto.setSat_opn_bsns_time(map.get("SAT_OPN_BSNS_TIME").toString());
				cultureBookDto.setSat_clos_time(map.get("SAT_CLOS_TIME").toString());
				cultureBookDto.setSun_opn_bsns_time(map.get("SUN_OPN_BSNS_TIME").toString());
				cultureBookDto.setSun_clos_time(map.get("SUN_CLOS_TIME").toString());
				cultureBookDto.setRstde_opn_bsns_time(map.get("RSTDE_OPN_BSNS_TIME").toString());
				cultureBookDto.setRstde_clos_time(map.get("RSTDE_CLOS_TIME").toString());
				cultureBookDto.setRstde_guid_cn(map.get("RSTDE_GUID_CN").toString());
				cultureBookDto.setTel_no(map.get("TEL_NO").toString());
				cultureBookDto.setOptn_dc(map.get("OPTN_DC").toString());
				cultureBookDto.setAdit_dc(map.get("ADIT_DC").toString());

				cultureDao.insertCultureBook(cultureBookDto);

				System.out.println("Complete Inserting Book Data");
			}
		}
		System.out.println("Complete All");
	}

	public void insertCultureBestsellerService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureBestsellerPKCnt(Integer.parseInt(map.get("SEQ_NO").toString()));

			if (cnt == 0) {
				CultureBestsellerDto cultureBestsellerDto = new CultureBestsellerDto();

				cultureBestsellerDto.setSeq_no(Integer.parseInt(map.get("SEQ_NO").toString()));
				cultureBestsellerDto.setRank_co(Integer.parseInt(map.get("RANK_CO").toString()));
				cultureBestsellerDto.setInpt_de(map.get("INPT_DE").toString());
				cultureBestsellerDto.setIsbn_ten_no(map.get("ISBN_TEN_NO").toString());
				cultureBestsellerDto.setIsbn_thirteen_no(map.get("ISBN_THIRTEEN_NO").toString());
				cultureBestsellerDto.setBook_title_nm(map.get("BOOK_TITLE_NM").toString());
				cultureBestsellerDto.setAuthr_nm(map.get("AUTHR_NM").toString());
				cultureBestsellerDto.setBook_intrcn_cn(map.get("BOOK_INTRCN_CN").toString());
				cultureBestsellerDto.setPublisher_nm(map.get("PUBLISHER_NM").toString());
				cultureBestsellerDto.setPblicte_de(map.get("PBLICTE_DE").toString());
				cultureBestsellerDto.setBook_cvr_image_nm(map.get("BOOK_CVR_IMAGE_NM").toString());
				cultureBestsellerDto.setBook_mastr_seq_no(map.get("BOOK_MASTR_SEQ_NO").toString());
				cultureBestsellerDto.setKdc_nm(map.get("KDC_NM").toString());

				cultureDao.insertCultureBestseller(cultureBestsellerDto);

				System.out.println("Complete Inserting Bestseller Data");
			}
		}
		System.out.println("Complete All");
	}

	public void insertCultureBookLibraryService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureBookLibraryPKCnt(Integer.parseInt(map.get("LBRRY_CD").toString()));

			if (cnt == 0 && map.get("ONE_AREA_NM").toString().equals("서울특별시")) {
				CultureBookLibraryDto cultureBookLibraryDtoDto = new CultureBookLibraryDto();

				cultureBookLibraryDtoDto.setLbrry_cd(Integer.parseInt(map.get("LBRRY_CD").toString()));
				cultureBookLibraryDtoDto.setLbrry_nm(map.get("LBRRY_NM").toString());
				cultureBookLibraryDtoDto.setLbrry_addr(map.get("LBRRY_ADDR").toString());
				cultureBookLibraryDtoDto.setLbrry_la(map.get("LBRRY_LA").toString());
				cultureBookLibraryDtoDto.setLbrry_lo(map.get("LBRRY_LO").toString());
				cultureBookLibraryDtoDto.setLbrry_no(map.get("LBRRY_NO").toString());
				cultureBookLibraryDtoDto.setTel_no(map.get("TEL_NO").toString());
				cultureBookLibraryDtoDto.setFax_no(map.get("FAX_NO").toString());
				cultureBookLibraryDtoDto.setHmpg_value(map.get("HMPG_VALUE").toString());
				cultureBookLibraryDtoDto.setOpnng_time(map.get("OPNNG_TIME").toString());
				cultureBookLibraryDtoDto.setClosedon_dc(map.get("CLOSEDON_DC").toString());
				cultureBookLibraryDtoDto.setLbrry_ty_nm(map.get("LBRRY_TY_NM").toString());
				cultureBookLibraryDtoDto.setFond_mby_value(map.get("FOND_MBY_VALUE").toString());
				cultureBookLibraryDtoDto.setOpnng_year(map.get("OPNNG_YEAR").toString());
				cultureBookLibraryDtoDto.setZip_no(map.get("ZIP_NO").toString());
				cultureBookLibraryDtoDto.setLbrry_ncm_nm(map.get("LBRRY_NCM_NM").toString());
				cultureBookLibraryDtoDto.setReprsnt_at(map.get("REPRSNT_AT").toString());

				cultureDao.insertCultureBookLibrary(cultureBookLibraryDtoDto);

				System.out.println("Complete Inserting Library Data");
			}
		}
		System.out.println("Complete All");
	}

	public void insertCultureMuseumInfoService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureMuseumInfoPKCnt(map.get("ID").toString());

			if (cnt == 0 && map.get("CTPRVN_NM").toString().equals("서울")) {
				CultureMuseumInfoDto cultureMuseumInfoDto = new CultureMuseumInfoDto();

				cultureMuseumInfoDto.setId(map.get("ID").toString());
				cultureMuseumInfoDto.setLclas_nm(map.get("LCLAS_NM").toString());
				cultureMuseumInfoDto.setMlsfc_nm(map.get("MLSFC_NM").toString());
				cultureMuseumInfoDto.setFclty_nm(map.get("FCLTY_NM").toString());
				cultureMuseumInfoDto.setRdnmadr_nm(map.get("RDNMADR_NM").toString());
				cultureMuseumInfoDto.setZip_no(map.get("ZIP_NO").toString());
				cultureMuseumInfoDto.setFclty_lo(map.get("FCLTY_LO").toString());
				cultureMuseumInfoDto.setFclty_la(map.get("FCLTY_LA").toString());
				cultureMuseumInfoDto.setFlag_nm(map.get("FLAG_NM").toString());
				cultureMuseumInfoDto.setTel_no(map.get("TEL_NO").toString());
				cultureMuseumInfoDto.setOpnng_de(map.get("OPNNG_DE").toString());
				cultureMuseumInfoDto.setHmpg_addr(map.get("HMPG_ADDR").toString());
				cultureMuseumInfoDto.setSound_provd_at(map.get("SOUND_PROVD_AT").toString());
				cultureMuseumInfoDto.setSound_utiliiza_price(map.get("SOUND_UTILIIZA_PRICE").toString());
				cultureMuseumInfoDto.setMobile_provd_at(map.get("MOBILE_PROVD_AT").toString());
				cultureMuseumInfoDto.setLnd_ar_value(map.get("LND_AR_VALUE").toString());
				cultureMuseumInfoDto.setTotar_value(map.get("TOTAR_VALUE").toString());
				cultureMuseumInfoDto.setDspyrm_artft_chg_co(map.get("DSPYRM_ARTFT_CHG_CO").toString());
				cultureMuseumInfoDto.setSpecl_dspy_ar_value(map.get("SPECL_DSPY_AR_VALUE").toString());
				cultureMuseumInfoDto.setData_co(map.get("DATA_CO").toString());
				cultureMuseumInfoDto.setParkng_posbl_co(map.get("PARKNG_POSBL_CO").toString());
				cultureMuseumInfoDto.setHdch_artft_knd_co(map.get("HDCH_ARTFT_KND_CO").toString());
				cultureMuseumInfoDto.setHdch_artft_cas_co(map.get("HDCH_ARTFT_CAS_CO").toString());
				cultureMuseumInfoDto.setHdch_artft_co(map.get("HDCH_ARTFT_CO").toString());
				cultureMuseumInfoDto.setCrlts_nm(map.get("CRLTS_NM").toString());
				cultureMuseumInfoDto.setCrlts_co(map.get("CRLTS_CO").toString());
				cultureMuseumInfoDto.setPblprfr_cas_co(map.get("PBLPRFR_CAS_CO").toString());
				cultureMuseumInfoDto.setTot_progrm_co(map.get("TOT_PROGRM_CO").toString());
				cultureMuseumInfoDto.setProgrm_co(map.get("PROGRM_CO").toString());
				cultureMuseumInfoDto.setFdrm_exprn_progrm_co(map.get("FDRM_EXPRN_PROGRM_CO").toString());
				cultureMuseumInfoDto.setNon_fdrm_exprn_progrm_co(map.get("NON_FDRM_EXPRN_PROGRM_CO").toString());
				cultureMuseumInfoDto.setOut_progrm_co(map.get("OUT_PROGRM_CO").toString());
				cultureMuseumInfoDto.setOpnng_day_co(map.get("OPNNG_DAY_CO").toString());
				cultureMuseumInfoDto.setOpnng_time(map.get("OPNNG_TIME").toString());
				cultureMuseumInfoDto.setViewng_nmpr_co(map.get("VIEWNG_NMPR_CO").toString());
				cultureMuseumInfoDto.setDay_avrg_viewng_nmpr_co(map.get("DAY_AVRG_VIEWNG_NMPR_CO").toString());
				cultureMuseumInfoDto.setViewng_price(map.get("VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setInfn_viewng_price(map.get("INFN_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setSchboy_viewng_price(map.get("SCHBOY_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setMsklsd_viewng_price(map.get("MSKLSD_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setAdult_viewng_price(map.get("ADULT_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setGrp_dscnt_rt(map.get("GRP_DSCNT_RT").toString());
				cultureMuseumInfoDto.setEtc_dscnt_rt(map.get("ETC_DSCNT_RT").toString());
				cultureMuseumInfoDto.setDscnt_cn(map.get("DSCNT_CN").toString());
				cultureMuseumInfoDto.setFre_trget_cn(map.get("FRE_TRGET_CN").toString());
				cultureMuseumInfoDto.setSpecl_viewng_price(map.get("SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setInfn_specl_viewng_price(map.get("INFN_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setSchboy_specl_viewng_price(map.get("SCHBOY_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setMsklsd_specl_viewng_price(map.get("MSKLSD_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setAdult_specl_viewng_price(map.get("ADULT_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setGrp_specl_viewng_rt(map.get("GRP_SPECL_VIEWNG_RT").toString());
				cultureMuseumInfoDto.setEtc_specl_viewng_dscnt_rt(map.get("ETC_SPECL_VIEWNG_DSCNT_RT").toString());
				cultureMuseumInfoDto.setEtc_specl_viewng_dscnt_cn(map.get("ETC_SPECL_VIEWNG_DSCNT_CN").toString());
				cultureMuseumInfoDto.setFre_specl_viewng_price(map.get("FRE_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setRm_cn(map.get("RM_CN").toString());

				cultureDao.insertCultureMuseumInfo(cultureMuseumInfoDto);

				System.out.println("Complete Inserting Library Data");
			}
		}
		System.out.println("Complete All");
	}

	public void insertCultureArtMuseumInfoService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureArtMuseumInfoPKCnt(map.get("ID").toString());

			if (cnt == 0 && map.get("CTPRVN_NM").toString().equals("서울")) {
				CultureArtMuseumInfoDto cultureMuseumInfoDto = new CultureArtMuseumInfoDto();

				cultureMuseumInfoDto.setId(map.get("ID").toString());
				cultureMuseumInfoDto.setLclas_nm(map.get("LCLAS_NM").toString());
				cultureMuseumInfoDto.setMlsfc_nm(map.get("MLSFC_NM").toString());
				cultureMuseumInfoDto.setFclty_nm(map.get("FCLTY_NM").toString());
				cultureMuseumInfoDto.setRdnmadr_nm(map.get("RDNMADR_NM").toString());
				cultureMuseumInfoDto.setZip_no(map.get("ZIP_NO").toString());
				cultureMuseumInfoDto.setFclty_lo(map.get("FCLTY_LO").toString());
				cultureMuseumInfoDto.setFclty_la(map.get("FCLTY_LA").toString());
				cultureMuseumInfoDto.setFlag_nm(map.get("FLAG_NM").toString());
				cultureMuseumInfoDto.setTel_no(map.get("TEL_NO").toString());
				cultureMuseumInfoDto.setOpnng_de(map.get("OPNNG_DE").toString());
				cultureMuseumInfoDto.setHmpg_addr(map.get("HMPG_ADDR").toString());
				cultureMuseumInfoDto.setSound_provd_at(map.get("SOUND_PROVD_AT").toString());
				cultureMuseumInfoDto.setSound_utiliiza_price(map.get("SOUND_UTILIIZA_PRICE").toString());
				cultureMuseumInfoDto.setMobile_provd_at(map.get("MOBILE_PROVD_AT").toString());
				cultureMuseumInfoDto.setLnd_ar_value(map.get("LND_AR_VALUE").toString());
				cultureMuseumInfoDto.setLnd_ar_value(map.get("BULD_AR_VALUE").toString());
				cultureMuseumInfoDto.setLnd_ar_value(map.get("DSPY_AR_CN").toString());
				cultureMuseumInfoDto.setData_co(map.get("DATA_CO").toString());
				cultureMuseumInfoDto.setPblprfr_cas_co(map.get("PBLPRFR_CAS_CO").toString());
				cultureMuseumInfoDto.setTot_progrm_co(map.get("TOT_PROGRM_CO").toString());
				cultureMuseumInfoDto.setOpnng_day_co(map.get("OPNNG_DAY_CO").toString());
				cultureMuseumInfoDto.setViewng_nmpr_co(map.get("VIEWNG_NMPR_CO").toString());
				cultureMuseumInfoDto.setDay_avrg_viewng_nmpr_co(map.get("DAY_AVRG_VIEWNG_NMPR_CO").toString());
				cultureMuseumInfoDto.setViewng_price(map.get("VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setInfn_viewng_price(map.get("INFN_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setSchboy_viewng_price(map.get("SCHBOY_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setMsklsd_viewng_price(map.get("MSKLSD_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setAdult_viewng_price(map.get("ADULT_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setGrp_dscnt_rt(map.get("GRP_DSCNT_RT").toString());
				cultureMuseumInfoDto.setEtc_dscnt_rt(map.get("ETC_DSCNT_RT").toString());
				cultureMuseumInfoDto.setDscnt_cn(map.get("DSCNT_CN").toString());
				cultureMuseumInfoDto.setFre_trget_cn(map.get("FRE_TRGET_CN").toString());
				cultureMuseumInfoDto.setSpecl_viewng_price(map.get("SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setInfn_specl_viewng_price(map.get("INFN_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setSchboy_specl_viewng_price(map.get("SCHBOY_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setMsklsd_specl_viewng_price(map.get("MSKLSD_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setAdult_specl_viewng_price(map.get("ADULT_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setGrp_specl_viewng_rt(map.get("GRP_SPECL_VIEWNG_RT").toString());
				cultureMuseumInfoDto.setEtc_specl_viewng_dscnt_rt(map.get("ETC_SPECL_VIEWNG_DSCNT_RT").toString());
				cultureMuseumInfoDto.setEtc_specl_viewng_dscnt_cn(map.get("ETC_SPECL_VIEWNG_DSCNT_CN").toString());
				cultureMuseumInfoDto.setFre_specl_viewng_price(map.get("FRE_SPECL_VIEWNG_PRICE").toString());
				cultureMuseumInfoDto.setRm_cn(map.get("RM_CN").toString());

				cultureDao.insertCultureArtMuseumInfo(cultureMuseumInfoDto);

				System.out.println("Complete Inserting Library Data");
			}
		}
		System.out.println("Complete All");
	}

	public void insertCultureMovieInfoService(HashMap<String, Object>[] maps) {
		System.out.println("Start");
		for (HashMap<String, Object> map : maps) {
			Integer cnt = cultureDao.selectCultureMovieInfoPKCnt(map.get("ID").toString());

			if (cnt == 0 && map.get("CTPRVN_NM").toString().equals("서울특별시")) {
				CultureMovieInfoDto cultureMovieInfoDto = new CultureMovieInfoDto();

				cultureMovieInfoDto.setMovie_id(map.get("ID").toString());
				cultureMovieInfoDto.setLclas_nm(map.get("LCLAS_NM").toString());
				cultureMovieInfoDto.setMlsfc_nm(map.get("MLSFC_NM").toString());
				cultureMovieInfoDto.setPoi_nm(map.get("POI_NM").toString());
				cultureMovieInfoDto.setBhf_nm(map.get("BHF_NM").toString());
				cultureMovieInfoDto.setAsstn_nm(map.get("ASSTN_NM").toString());
				cultureMovieInfoDto.setCl_nm(map.get("CL_NM").toString());
				cultureMovieInfoDto.setCtprvn_nm(map.get("CTPRVN_NM").toString());
				cultureMovieInfoDto.setSigngu_nm(map.get("SIGNGU_NM").toString());
				cultureMovieInfoDto.setRdnmadr_nm(map.get("RDNMADR_NM").toString());
				cultureMovieInfoDto.setBuld_no(map.get("BULD_NO").toString());
				cultureMovieInfoDto.setLc_lo(map.get("LC_LO").toString());
				cultureMovieInfoDto.setLc_la(map.get("LC_LA").toString());
				cultureMovieInfoDto.setOrigin_nm(map.get("ORIGIN_NM").toString());

				cultureDao.insertCultureMovieInfo(cultureMovieInfoDto);

				System.out.println("Complete Inserting Movie Data");
			}
		}
		System.out.println("Complete All");
	}


	// OPEN API를 활용해 획득한 XML 데이터 JSON으로 변환하는 함수
	public String getXmlToJsonService(String url) throws Exception {
		// OPEN API를 활용해 xml 데이터 획득
		RestTemplate restTemplate = new RestTemplate();
		String xmlData = restTemplate.getForObject(url, String.class);

		// XmlMapper를 사용해 XML을 JsonNode로 변환
		XmlMapper xmlMapper = new XmlMapper();
		JsonNode node = xmlMapper.readTree(xmlData.getBytes());

		// ObjectMapper를 사용해 JsonNode를 문자열로 변환
		ObjectMapper jsonMapper = new ObjectMapper();
		String json = jsonMapper.writeValueAsString(node);

		return json;
	}

	public Map<String, Object> getXmlToJsonMapService(String url) throws Exception {
		// 스트링의 의도치 않은 변환 가능성 제거
		URI uri = new URI(url);

		// OPEN API를 활용해 xml 데이터 획득
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Map<String, Object>> response = restTemplate.exchange(uri, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});

		return response.getBody();
	}


	// Google Place 사용 함수
	public ResponseEntity<?> getCulturalMovieDetailInfoService(String name, String address, String apiKey) throws Exception {
		// [ Text Search API로 place_id 검색 ]
		String query = URLEncoder.encode(name+" "+address, StandardCharsets.UTF_8);
		String textSearchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?language=ko&query="+query+"&key="+apiKey;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Map<String, Object>> response = restTemplate.exchange(new URI(textSearchUrl), HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});
		Map<String, Object> textSearchResult = response.getBody();

		// 데이터가 존재하는지 확인 후 place_id 추출
		List<Map<String,Object>> results = (List<Map<String,Object>>) textSearchResult.get("results");
		if (results.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No match found");
		}

		String placeId = (String) results.get(0).get("place_id");

		// [ Place Details API로 상세 정보 획득 ]
		String detailUrl = "https://maps.googleapis.com/maps/api/place/details/json?language=ko&place_id="+placeId+"&key="+apiKey;
		response = restTemplate.exchange(new URI(detailUrl), HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {});
		Map<String, Object> detailResult = response.getBody();

		return ResponseEntity.ok(detailResult);
	}
}
