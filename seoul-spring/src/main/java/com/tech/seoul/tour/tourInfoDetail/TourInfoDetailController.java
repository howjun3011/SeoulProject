// TourInfoDetailController.java
package com.tech.seoul.tour.tourInfoDetail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/tour/detail")
public class TourInfoDetailController {

    @Autowired
    private TourInfoDetailService tourInfoDetailService;

    // 테스트용 엔드포인트 (필요에 따라 추가)
    @GetMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, Object> selectTestHealth() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("message", "Tour Info Detail API is working!");
        return response;
    }

    @GetMapping("/nearby")
    public List<TourInfoDetailDTO> getNearbyTourInfos(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") double radius,
            @RequestParam(required = false) String cat1) {
        return tourInfoDetailService.getNearbyTourInfos(latitude, longitude, radius, cat1);
    }
}
