package com.tech.seoul.edu.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KidsLocalCenterDetailDto;
import com.tech.seoul.edu.models.KinderDetailInfoDto;

@Service
public class LocalCenterInfoService {
	private EduDao eduDao;
	
	public LocalCenterInfoService(EduDao eduDao) {
		this.eduDao = eduDao;
	}
	
	public KidsLocalCenterDetailDto DetailInfo(
			HttpServletRequest request) {
		String center_name = request.getParameter("centerName");
		String address = request.getParameter("centerAddress");
		KidsLocalCenterDetailDto centerInfo = 
				eduDao.selectCenterInfo(center_name, address);
		
		int regular_start_time = centerInfo.getRegular_start_time();
	    int regular_end_time = centerInfo.getRegular_end_time();
	    int vacation_start_time = centerInfo.getVacation_start_time();
	    int vacation_end_time = centerInfo.getVacation_end_time();
	    int saturday_start_time = centerInfo.getSaturday_start_time();
	    int saturday_end_time = centerInfo.getSaturday_end_time();
		
		centerInfo.setFormat_regular(timeFormat(regular_start_time,regular_end_time));
		centerInfo.setFormat_saturday(timeFormat(saturday_start_time,saturday_end_time));
		centerInfo.setFormat_vacation(timeFormat(vacation_start_time,vacation_end_time));
		
		return centerInfo;
	}
	
	public String timeFormat(int start, int end) {
		String start_end;
		if(start !=0 || end !=0) {
			String hh_start = String.format("%02d",start/100);
			String mm_start = String.format("%02d", start%100);
			String hh_end = String.format("%02d",end/100);
			String mm_end = String.format("%02d", end%100);
			start_end = hh_start+":"+mm_start+" ~ "+hh_end+":"+mm_end;
		} else {
			start_end = "미운영";
		}
		
		return start_end;
	}
}
