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
//		double swLat = Double.parseDouble(request.getParameter("swLat"));
//		double swLng = Double.parseDouble(request.getParameter("swLng"));
//		double neLat = Double.parseDouble(request.getParameter("neLat"));
//		double neLng = Double.parseDouble(request.getParameter("neLng"));
		String swLat = request.getParameter("swLat");
		String swLng = request.getParameter("swLng");
		String neLat = request.getParameter("neLat");
		String neLng = request.getParameter("neLng");
		System.out.println("swLat: "+swLat);
		System.out.println("swLng: "+swLng);
		System.out.println("neLat: "+neLat);
		System.out.println("neLng: "+neLng);
		return eduDao.KindergartenNormal(swLat,swLng,neLat,neLng);
	}
}
