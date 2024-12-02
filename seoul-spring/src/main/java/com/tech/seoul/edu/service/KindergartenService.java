package com.tech.seoul.edu.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KindergartenDto;

@Service
public class KindergartenService {

	private EduDao eduDao;
	
	public KindergartenService(EduDao eduDao) {
		this.eduDao = eduDao;
	}
	
	public List<KindergartenDto> kindergartenInfo() {
		
		List<KindergartenDto> test11 = eduDao.KindergartenNormal();
		
		return test11;
	}
}
