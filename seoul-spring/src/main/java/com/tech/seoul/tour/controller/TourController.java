package com.tech.seoul.tour.controller;

import com.tech.seoul.tour.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TourController {

    @Autowired
    private TourService tourService;

    @GetMapping("/tour")
    public String getTourInfo(@RequestParam String keyword) {
        return tourService.getTourInfo(keyword);
    }
}
