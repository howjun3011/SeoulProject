package com.tech.seoul.culture.service;

import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.tech.seoul.culture.models.CultureBestsellerDto;
import com.tech.seoul.culture.models.CultureBookDto;
import com.tech.seoul.culture.models.CultureBookLibraryDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.tech.seoul.culture.models.CultureDao;
import org.springframework.web.client.RestTemplate;

@Service
public class CultureService {
	private CultureDao cultureDao;
	
	public CultureService(CultureDao cultureDao) {
		this.cultureDao = cultureDao;
	}

	@Value("${national.library.key}")
	private String nationalLibraryKey;

	// DB 정보 획득
	public List<CultureBookDto> selectCultureBookService() {return cultureDao.selectCultureBook();}
	public List<CultureBestsellerDto> selectCultureBestsellerService() {return cultureDao.selectCultureBestseller();}
	public List<CultureBookLibraryDto> selectCultureBookLibraryService() {return cultureDao.selectCultureBookLibrary();}

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
			Integer cnt = cultureDao.selectCultureBookPKCnt(map.get("LBRRY_CD").toString());

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

	// 국립중앙도서관 OPEN API
	public String getNationalLibraryService(String url) throws Exception {
		// 국립중앙도서관 OPEN API를 활용해 xml 데이터 획득
		RestTemplate restTemplate = new RestTemplate();
		String xmlData = restTemplate.getForObject(url+nationalLibraryKey, String.class);

		// XmlMapper를 사용해 XML을 JsonNode로 변환
		XmlMapper xmlMapper = new XmlMapper();
		JsonNode node = xmlMapper.readTree(xmlData.getBytes());

		// ObjectMapper를 사용해 JsonNode를 문자열로 변환
		ObjectMapper jsonMapper = new ObjectMapper();
		String json = jsonMapper.writeValueAsString(node);

		return json;
	}
}
