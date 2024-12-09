package com.tech.seoul.tour.tourPet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TourPetService {

    @Autowired
    private TourPetRepository tourPetRepository;

    public List<TourPetDTO> getNearbyTourInfos(double latitude, double longitude, double radius, String cat1) {
        // Repository에서 데이터 가져오기
        List<Object[]> results = tourPetRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);
        List<TourPetDTO> tourInfos = new ArrayList<>();

        System.out.println("Fetched " + results.size() + " records from database.");

        for (Object[] row : results) {
            TourPetDTO dto = new TourPetDTO();
            try {
                dto.setTourPetId((Integer) row[0]);               // Integer - tour_pet_id
                dto.setAddr1((String) row[1]);                    // String - 주소 1
                dto.setAddr2((String) row[2]);                    // String - 주소 2
                dto.setAreacode((String) row[3]);                 // String - 지역 코드
                dto.setCat1((String) row[4]);                     // String - 대분류
                dto.setCat2((String) row[5]);                     // String - 중분류
                dto.setCat3((String) row[6]);                     // String - 소분류
                dto.setContentid((String) row[7]);                // String - 콘텐츠 ID
                dto.setContenttypeid((String) row[8]);            // String - 콘텐츠 타입 ID
                // Timestamp을 LocalDateTime으로 변환
                if (row[9] != null) {
                    dto.setCreatedtime(((Timestamp) row[9]).toLocalDateTime());  // LocalDateTime - 생성 시간
                } else {
                    dto.setCreatedtime(null);
                }
                dto.setFirstimage((String) row[10]);               // String - 첫 번째 이미지 URL
                dto.setFirstimage2((String) row[11]);              // String - 두 번째 이미지 URL
                dto.setCpyrhtDivCd((String) row[12]);              // String - 저작권 구분 코드
                dto.setMapx(((Number) row[13]).doubleValue());     // Double - 지도 X좌표
                dto.setMapy(((Number) row[14]).doubleValue());     // Double - 지도 Y좌표
                dto.setMlevel((String) row[15]);                   // String - 지도 수준
                // Timestamp을 LocalDateTime으로 변환
                if (row[16] != null) {
                    dto.setModifiedtime(((Timestamp) row[16]).toLocalDateTime()); // LocalDateTime - 수정 시간
                } else {
                    dto.setModifiedtime(null);
                }
                dto.setSigungucode((String) row[17]);              // String - 시군구 코드
                dto.setTel((String) row[18]);                      // String - 전화번호
                dto.setTitle((String) row[19]);                    // String - 제목
                dto.setZipcode((String) row[20]);                  // String - 우편번호
                dto.setDistance(((Number) row[21]).doubleValue());// Double - 거리

                // DTO 리스트에 추가
                tourInfos.add(dto);
            } catch (ClassCastException e) {
                System.err.println("Error mapping row to TourPetDTO: " + e.getMessage());
                // 필요시 해당 row를 로깅하거나 스킵할 수 있습니다.
            }
        }

        System.out.println("Mapped " + tourInfos.size() + " TourPetDTO objects.");
        return tourInfos;
    }
}
