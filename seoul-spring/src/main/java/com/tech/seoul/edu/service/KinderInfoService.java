package com.tech.seoul.edu.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KinderDetailInfoDto;

@Service
public class KinderInfoService {
	private EduDao eduDao;
	
	public KinderInfoService(EduDao eduDao) {
		this.eduDao = eduDao;
	}
	
	public KinderDetailInfoDto DetailInfo(
			HttpServletRequest request) {
		String kindergarten_name = request.getParameter("kinderName");
		String address = request.getParameter("kinderAddress");
		KinderDetailInfoDto kinderInfo = 
				eduDao.selectKinderInfo(kindergarten_name, address);
		return kinderInfo;
	}
	
}
