// TourInfoService.java
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
            // 디버깅을 위한 로그 출력 (필요에 따라 주석 처리 가능)
            /*
            System.out.println("Row data:");
            for (int i = 0; i < row.length; i++) {
                System.out.println("Index " + i + ": " + row[i] + " (" + (row[i] != null ? row[i].getClass().getName() : "null") + ")");
            }
            */
            TourInfoDTO dto = new TourInfoDTO();
            dto.setTourInfoId(((Number) row[0]).intValue());    // Integer
            dto.setTitle((String) row[1]);                       // String
            dto.setMapX(((Number) row[2]).doubleValue());        // Double
            dto.setMapY(((Number) row[3]).doubleValue());        // Double
            dto.setCat1((String) row[4]);                        // String
            dto.setCat2((String) row[5]);                        // String
            dto.setCat3((String) row[6]);                        // String
            dto.setImageUrl((String) row[7]);                    // String (이미지 URL)
            dto.setDistance(((Number) row[8]).doubleValue());    // Double
            tourInfos.add(dto);
        }

        return tourInfos;
    }
}
