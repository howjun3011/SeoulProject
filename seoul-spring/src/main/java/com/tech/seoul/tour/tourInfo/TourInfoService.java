// TourInfoService.java
package com.tech.seoul.tour.tourInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * TourInfoService는 관광 정보 비즈니스 로직을 처리하는 서비스 클래스이다.
 * 데이터 접근 계층(Repository)과 컨트롤러 사이에서 중간 역할을 수행하며,
 * 요청된 조건에 맞는 관광지 정보를 조회하고 가공하여 반환한다.
 */
@Service // 해당 클래스가 서비스 레이어의 빈(Bean)으로 스프링에 등록됨을 나타냄
public class TourInfoService {

    @Autowired // TourInfoRepository를 의존성 주입(DI)한다.
    private TourInfoRepository tourInfoRepository;

    /**
     * 위도, 경도, 반경 및 카테고리를 기반으로 주변 관광 정보를 조회한다.
     * Repository에서 반환된 결과(Object[] 형태)를 DTO 리스트로 변환한다.
     *
     * @param latitude  double - 중심 위치의 위도
     * @param longitude double - 중심 위치의 경도
     * @param radius    double - 조회 반경 (단위: km)
     * @param cat1      String - 관광지의 주요 카테고리(선택 사항)
     * @return List<TourInfoDTO> - 관광 정보 리스트를 반환
     */
    public List<TourInfoDTO> getNearbyTourInfos(double latitude, double longitude, double radius, String cat1) {
        // Repository를 통해 DB에서 조회된 결과를 가져옴
        List<Object[]> results = tourInfoRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);

        // 결과를 담을 DTO 리스트 초기화
        List<TourInfoDTO> tourInfos = new ArrayList<>();

        // 결과 데이터를 순회하며 DTO 객체로 변환
        for (Object[] row : results) {
            // 디버깅용 로그 출력 (개발 및 테스트 중 필요 시 사용)
            /*
            System.out.println("Row data:");
            for (int i = 0; i < row.length; i++) {
                System.out.println("Index " + i + ": " + row[i] + " (" + (row[i] != null ? row[i].getClass().getName() : "null") + ")");
            }
            */

            // DTO 객체 생성 및 필드 설정
            TourInfoDTO dto = new TourInfoDTO();
            dto.setTourInfoId(((Number) row[0]).intValue());    // 관광 정보 ID (Integer)
            dto.setTitle((String) row[1]);                     // 관광지 제목 (String)
            dto.setMapX(((Number) row[2]).doubleValue());       // X좌표 (Double)
            dto.setMapY(((Number) row[3]).doubleValue());       // Y좌표 (Double)
            dto.setCat1((String) row[4]);                      // 카테고리 1 (String)
            dto.setCat2((String) row[5]);                      // 카테고리 2 (String)
            dto.setCat3((String) row[6]);                      // 카테고리 3 (String)
            dto.setImageUrl((String) row[7]);                  // 이미지 URL (String)
            dto.setTel((String) row[8]);                       // 전화번호 (String)
            dto.setAddr1((String) row[9]);                     // 주소 1 (String)
            dto.setAddr2((String) row[10]);                    // 주소 2 (String)
            dto.setContentid(((Number) row[11]).intValue());   // 콘텐츠 ID (Integer)
            dto.setContenttypeid(((Number) row[12]).intValue());// 콘텐츠 타입 ID (Integer)
            dto.setDistance(((Number) row[13]).doubleValue()); // 거리 (Double)

            // 변환된 DTO를 리스트에 추가
            tourInfos.add(dto);
        }

        // 최종 DTO 리스트 반환
        return tourInfos;
    }
}
