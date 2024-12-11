package com.tech.seoul.edu.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.tech.seoul.edu.models.EduDao;
import com.tech.seoul.edu.models.KidsLocalCenterNameDto;
import com.tech.seoul.edu.models.PageInfoDto;
import com.tech.seoul.edu.models.PlayNameDto;
import com.tech.seoul.edu.util.EduSearchVO;

@Service
public class PlayService {
	
	private EduDao eduDao;
	
	public PlayService(EduDao eduDao) {
		this.eduDao = eduDao;
	};
	
	public PageInfoDto<PlayNameDto> playInfo(
			HttpServletRequest request,
			EduSearchVO searchVO) {
		String query = request.getParameter("query");
		String areas = request.getParameter("areas");
		String[] areas_array = areas.split(",");
		
		if (searchVO == null) {
		    searchVO = new EduSearchVO();
		}
		
		int total = 0;
		total = eduDao.playNameCnt(query, areas_array);
		String strPage = request.getParameter("page");
		if(strPage == null || strPage.isEmpty()) {
 			strPage="1";
 		}
		int page = Integer.parseInt(strPage);
		searchVO.setPage(page);
		
		searchVO.pageCalculate(total);
		
		int rowStart = searchVO.getRowStart();
		int rowEnd = searchVO.getRowEnd();
		List<PlayNameDto> items =
				eduDao.playName(query, areas_array,(rowStart-1),8);
		return new PageInfoDto<>(items,total,searchVO);
	}
}
