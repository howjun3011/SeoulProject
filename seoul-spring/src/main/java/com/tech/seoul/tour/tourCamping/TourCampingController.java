// TourCampingController.java
package com.tech.seoul.tour.tourCamping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/tour/camping")
public class TourCampingController {

    @Autowired
    private TourCampingService tourCampingService;

    // 테스트용 엔드포인트 (필요에 따라 추가)
    @GetMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, Object> selectTestHealth() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("message", "Tour Camping API is working!");
        return response;
    }

    @GetMapping("/nearby")
    public List<TourCampingDTO> getNearbyTourInfos(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") double radius,
            @RequestParam(required = false) String cat1) {
        return tourCampingService.getNearbyTourCampings(latitude, longitude, radius, cat1);
    }
}
