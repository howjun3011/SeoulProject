package com.tech.seoul.tour.tourFestival;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/tour/festival")
public class TourFestivalController {

    @Autowired
    private TourFestivalService tourFestivalService;

    @GetMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, Object> testApi() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("message", "Tour Festival API is working!");
        return response;
    }

    @GetMapping("/nearby")
    public List<TourFestivalDTO> getNearbyFestivals(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") double radius,
            @RequestParam(required = false) String cat1) {
        return tourFestivalService.getNearbyFestivals(latitude, longitude, radius, cat1);
    }
}
