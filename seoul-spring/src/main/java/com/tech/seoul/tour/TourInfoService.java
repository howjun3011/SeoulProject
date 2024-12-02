package com.tech.seoul.tour;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourInfoService {

    @Autowired
    private TourInfoRepository tourInfoRepository;

    public List<TourInfoDTO> getNearbyTourInfos(double latitude, double longitude, double radius, String cat1) {
        List<Object[]> results = tourInfoRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);
        List<TourInfoDTO> tourInfos = new ArrayList<>();

        for (Object[] row : results) {
            TourInfoDTO dto = new TourInfoDTO();
            dto.setTourInfoId(((Number) row[0]).intValue());
            dto.setTitle((String) row[1]);
            dto.setMapX(((Number) row[2]).doubleValue());
            dto.setMapY(((Number) row[3]).doubleValue());
            dto.setCat1((String) row[4]);
            dto.setDistance(((Number) row[5]).doubleValue());
            tourInfos.add(dto);
        }

        return tourInfos;
    }
}
