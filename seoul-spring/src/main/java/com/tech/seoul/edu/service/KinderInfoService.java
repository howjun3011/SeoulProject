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
		
		System.out.println("kindergarten_name : " + kindergarten_name);
		System.out.println("address : " + address);
		KinderDetailInfoDto kinderInfo = 
				eduDao.selectKinderInfo(kindergarten_name, address);
//		KinderAfterDto kinderAfter = eduDao.selectkinderAfter(kindergarten_name,address);
//		KinderCarDto kinderCar = eduDao.selectkinderCar(kindergarten_name,address);
//		KinderClassroomDto kinderClass = eduDao.selectkinderClass(kindergarten_name,address);
//		KinderMealsDto kinderMeals = eduDao.selectkinderMeals(kindergarten_name,address);
//		KinderNormalDto kinderNormal = eduDao.selectkinderNormal(kindergarten_name,address);
//		KinderSafetyDto kinderSafty = eduDao.selectkinderSafty(kindergarten_name,address);
		
//		KinderInfoDto(kinderAfter,kinderCar,kinderClass,kinderMeals,kinderNormal,kinderSafty);
		return kinderInfo;
	}
	
}
