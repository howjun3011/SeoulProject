package com.tech.seoul.edu.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KidsBringCenterDetailDto;
import com.tech.seoul.edu.models.KidsLocalCenterDetailDto;
import com.tech.seoul.edu.models.KinderDetailInfoDto;

@Service
public class LocalCenterInfoService {
	private EduDao eduDao;
	
	public LocalCenterInfoService(EduDao eduDao) {
		this.eduDao = eduDao;
	}

	public ResponseEntity<?> DetailInfo(
			HttpServletRequest request) {
		
		String service_type = request.getParameter("service_type");
		String center_name = request.getParameter("selectName");
		String address = request.getParameter("selectAddress");
		Object centerInfo = null;
		if(service_type.equals("지역아동센터")) {
			KidsLocalCenterDetailDto localCenterInfo = 
					eduDao.localCenterInfo(center_name, address);
			
			int regular_start_time = localCenterInfo.getRegular_start_time();
			int regular_end_time = localCenterInfo.getRegular_end_time();
			int vacation_start_time = localCenterInfo.getVacation_start_time();
			int vacation_end_time = localCenterInfo.getVacation_end_time();
			int saturday_start_time = localCenterInfo.getSaturday_start_time();
			int saturday_end_time = localCenterInfo.getSaturday_end_time();
			
			localCenterInfo.setFormat_regular(timeFormat(regular_start_time,regular_end_time));
			localCenterInfo.setFormat_saturday(timeFormat(saturday_start_time,saturday_end_time));
			localCenterInfo.setFormat_vacation(timeFormat(vacation_start_time,vacation_end_time));
			centerInfo = localCenterInfo;
			
		} else if(service_type.equals("우리동네키움센터") 
				|| service_type.equals("융합형키움센터")
				|| service_type.equals("거점형키움센터")) {
			KidsBringCenterDetailDto bringCenterInfo = 
					eduDao.bringCenterInfo(center_name, address);
			
			int regular_start_time = bringCenterInfo.getRegular_start_time();
			int regular_end_time = bringCenterInfo.getRegular_end_time();
			int vacation_start_time = bringCenterInfo.getVacation_start_time();
			int vacation_end_time = bringCenterInfo.getVacation_end_time();
			int saturday_start_time = bringCenterInfo.getSaturday_start_time();
			int saturday_end_time = bringCenterInfo.getSaturday_end_time();
			int discretion_start_time = bringCenterInfo.getDiscretion_start_time();
			int discretion_end_time = bringCenterInfo.getDiscretion_end_time();
			
			bringCenterInfo.setFormat_regular(timeFormat(regular_start_time,regular_end_time));
			bringCenterInfo.setFormat_saturday(timeFormat(saturday_start_time,saturday_end_time));
			bringCenterInfo.setFormat_vacation(timeFormat(vacation_start_time,vacation_end_time));
			bringCenterInfo.setFormat_discretion(timeFormat(discretion_start_time,discretion_end_time));
			centerInfo = bringCenterInfo;
			
		}
		
		return ResponseEntity.ok(centerInfo);
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
