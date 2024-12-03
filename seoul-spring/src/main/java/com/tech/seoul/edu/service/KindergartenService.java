package com.tech.seoul.edu.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KindergartenDto;

@Service
public class KindergartenService {

	private EduDao eduDao;
	
	public KindergartenService(EduDao eduDao) {
		this.eduDao = eduDao;
	}
	
	public List<KindergartenDto> kindergartenInfo(
			HttpServletRequest request) {
		
		String query = request.getParameter("query");
		String areas = request.getParameter("areas");
		String[] areas_array = areas.split(",");
		for (String str : areas_array) {
			System.out.println("서비스에서 데이터 받음 지역배열 : "+ str);
		}
		System.out.println("서비스에서 데이터 받음 쿼리 : "+ query);
		return null;//eduDao.KindergartenNormal(swLat,swLng,neLat,neLng);
	}
}
