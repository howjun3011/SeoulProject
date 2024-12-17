package com.tech.seoul.exercise.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tech.seoul.exercise.models.ExerciseDetailDto;
import com.tech.seoul.exercise.service.ExerciseDetailService;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exercise")
public class ExerciseController {

    private final ExerciseDetailService exerciseDetailService;

    public ExerciseController(ExerciseDetailService exerciseDetailService) {
        this.exerciseDetailService = exerciseDetailService;
    }

    // 반경 내 필터 + 종목 필터 API
    @GetMapping("/nearby")
    public List<ExerciseDetailDto> getNearbyExercise(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius,
            @RequestParam(required = false) String exerciseType) {
        return exerciseDetailService.getNearbyDetails(latitude, longitude, radius, exerciseType);
    }

    // 특정 위치의 상세 목록 조회 API
    @GetMapping("/details")
    public List<ExerciseDetailDto> getExerciseDetailsByLatLong(
            @RequestParam double lat,
            @RequestParam double lot,
            @RequestParam(required = false) String exerciseType) {
        return exerciseDetailService.getDetailsByLatLong(lat, lot, exerciseType);
    }
}