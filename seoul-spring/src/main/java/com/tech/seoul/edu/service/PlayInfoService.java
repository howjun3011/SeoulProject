package com.tech.seoul.edu.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KidsLocalCenterDetailDto;
import com.tech.seoul.edu.models.KinderDetailInfoDto;
import com.tech.seoul.edu.models.PlayDetailInfoDto;

@Service
public class PlayInfoService {
	private EduDao eduDao;
	
	public PlayInfoService(EduDao eduDao) {
		this.eduDao = eduDao;
	}
	
	public PlayDetailInfoDto DetailInfo(
			HttpServletRequest request) {
		String center_name = request.getParameter("selectName");
		String address = request.getParameter("selectAddress");
		PlayDetailInfoDto playInfo = 
				eduDao.selectPlayInfo(center_name, address);
		if(playInfo.getFree_price() == "N") {
			playInfo.setFree_price("유료");
		} else if(playInfo.getFree_price() == "Y") {
			playInfo.setFree_price("무료");
		};
		return playInfo;
	}
}
