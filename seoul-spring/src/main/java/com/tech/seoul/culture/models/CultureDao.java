package com.tech.seoul.culture.models;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CultureDao {
	public Integer selectCultureBookPKCnt(String esntl_id);
	public Integer selectCultureBestsellerPKCnt(int seq_no);
	public Integer selectCultureBookLibraryPKCnt(int lbrry_cd);
	public Integer selectCultureMuseumInfoPKCnt(String id);
	public Integer selectCultureArtMuseumInfoPKCnt(String id);
	public List<CultureBookDto> selectCultureBook();
	public List<CultureBestsellerDto> selectCultureBestseller();
	public List<CultureBookLibraryDto> selectCultureBookLibrary();
	public List<CultureMuseumInfoDto> selectCultureMuseumInfo();
	public List<CultureArtMuseumInfoDto> selectCultureArtMuseumInfo();
	public void insertCultureBook(CultureBookDto cultureBookDto);
	public void insertCultureBestseller(CultureBestsellerDto cultureBestsellerDto);
	public void insertCultureBookLibrary(CultureBookLibraryDto cultureBookLibraryDto);
	public void insertCultureMuseumInfo(CultureMuseumInfoDto cultureMuseumInfoDto);
	public void insertCultureArtMuseumInfo(CultureArtMuseumInfoDto cultureArtMuseumInfoDto);
}
