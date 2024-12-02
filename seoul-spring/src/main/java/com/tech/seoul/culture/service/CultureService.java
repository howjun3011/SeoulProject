package com.tech.seoul.culture.service;

import java.util.HashMap;
import java.util.List;

import com.tech.seoul.culture.models.CultureBookDto;
import org.springframework.stereotype.Service;

import com.tech.seoul.culture.models.CultureDao;

@Service
public class CultureService {
	private CultureDao cultureDao;
	
	public CultureService(CultureDao cultureDao) {
		this.cultureDao = cultureDao;
	}

	public List<CultureBookDto> selectCultureBookService() {return cultureDao.selectCultureBook();}

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
}
