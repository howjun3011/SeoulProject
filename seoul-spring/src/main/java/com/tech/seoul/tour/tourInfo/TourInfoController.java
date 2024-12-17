// TourInfoController.java
package com.tech.seoul.tour.tourInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

/**
 * TourInfoController는 관광 정보 API의 요청을 처리하는 컨트롤러 클래스이다.
 * 클라이언트의 요청을 받아 비즈니스 로직(Service 계층)으로 전달하고,
 * 그 결과를 JSON 형식으로 응답한다.
 */
@RestController // 해당 클래스가 REST 컨트롤러임을 나타냄. JSON 형식의 데이터를 반환한다.
@RequestMapping("/tour") // 기본 URL 경로를 설정함. 이 컨트롤러의 엔드포인트들은 "/tour"로 시작한다.
public class TourInfoController {

    @Autowired // TourInfoService를 의존성 주입(DI)한다.
    private TourInfoService tourInfoService;

    /**
     * 테스트용 엔드포인트로, API가 정상적으로 작동하는지 확인하기 위한 메서드이다.
     * GET 방식의 요청을 처리하며, JSON 형식의 메시지를 반환한다.
     *
     * @return HashMap<String, Object> - 테스트 메시지를 포함한 JSON 객체 반환
     */
    @GetMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, Object> selectTestHealth() {
        // 응답 객체 생성
        HashMap<String, Object> response = new HashMap<>();
        response.put("message", "Tour Info API is working!"); // 테스트 메시지 삽입
        return response; // 클라이언트에게 응답 반환
    }

    /**
     * 주변 관광지 정보를 조회하는 엔드포인트이다.
     * 요청 시 위도, 경도, 반경(radius) 값을 받아 해당 범위 내의 관광 정보를 제공한다.
     *
     * @param latitude  double - 위도 (필수)
     * @param longitude double - 경도 (필수)
     * @param radius    double - 조회 반경 (선택, 기본값: 5km)
     * @param cat1      String - 관광지 카테고리(선택)
     * @return List<TourInfoDTO> - 조회된 관광 정보 리스트를 반환
     */
    @GetMapping("/nearby") // GET 요청을 처리하며, "/tour/nearby" 경로로 매핑됨
    public List<TourInfoDTO> getNearbyTourInfos(
            @RequestParam double latitude,          // 요청 파라미터: 위도
            @RequestParam double longitude,         // 요청 파라미터: 경도
            @RequestParam(defaultValue = "5") double radius, // 요청 파라미터: 반경, 기본값은 5km
            @RequestParam(required = false) String cat1) {    // 요청 파라미터: 카테고리, 선택적 파라미터
        // Service 계층에 위도, 경도, 반경, 카테고리를 전달해 관광지 정보를 조회한다.
        return tourInfoService.getNearbyTourInfos(latitude, longitude, radius, cat1);
    }
}
