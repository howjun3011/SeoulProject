package com.tech.seoul.tour.tourInfoDetail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourInfoDetailService {

    @Autowired
    private TourInfoDetailRepository tourInfoDetailRepository;

    public List<TourInfoDetailDTO> getNearbyTourInfos(double latitude, double longitude, double radius, String cat1) {
        // Repository에서 데이터 가져오기
        List<Object[]> results = tourInfoDetailRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);
        List<TourInfoDetailDTO> tourInfos = new ArrayList<>();

        for (Object[] row : results) {
            // 디버깅용 로그 (필요 시 활성화)
            /*
            System.out.println("Row data:");
            for (int i = 0; i < row.length; i++) {
                System.out.println("Index " + i + ": " + row[i] + " (" + (row[i] != null ? row[i].getClass().getName() : "null") + ")");
            }
            */

            // DTO 생성 및 데이터 매핑
            TourInfoDetailDTO dto = new TourInfoDetailDTO();
            dto.setContentid((String) row[0]);                  // String - 콘텐츠 ID
            dto.setTitle((String) row[1]);                     // String - 제목
            dto.setMapx(((Number) row[2]).doubleValue());      // Double - 지도 X좌표
            dto.setMapy(((Number) row[3]).doubleValue());      // Double - 지도 Y좌표
            dto.setCat1((String) row[4]);                      // String - 대분류
            dto.setCat2((String) row[5]);                      // String - 중분류
            dto.setCat3((String) row[6]);                      // String - 소분류
            dto.setFirstimage((String) row[7]);                // String - 첫 번째 이미지 URL
            dto.setTel((String) row[8]);                      // String - 전화번호
            dto.setAddr1((String) row[9]);                    // String - 주소 1
            dto.setAddr2((String) row[10]);                   // String - 주소 2
            dto.setDistance(((Number) row[11]).doubleValue()); // Double - 거리

            // DTO 리스트에 추가
            tourInfos.add(dto);
        }

        return tourInfos;
    }
}
