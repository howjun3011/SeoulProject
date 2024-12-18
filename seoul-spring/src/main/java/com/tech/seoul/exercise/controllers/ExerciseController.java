package com.tech.seoul.exercise.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tech.seoul.exercise.models.ExerciseDetailDto;
import com.tech.seoul.exercise.service.ExerciseDetailService;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exercise")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 도메인으로 변경 시 수정
public class ExerciseController {

    private final ExerciseDetailService exerciseDetailService;

    public ExerciseController(ExerciseDetailService exerciseDetailService) {
        this.exerciseDetailService = exerciseDetailService;
    }

    // 기존 /nearby 엔드포인트
    @GetMapping("/nearby")
    public List<ExerciseDetailDto> getNearbyExercise(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius,
            @RequestParam(required = false) String exerciseType) {
        return exerciseDetailService.getNearbyDetails(latitude, longitude, radius, exerciseType);
    }

    // 기존 /details 엔드포인트
    @GetMapping("/details")
    public List<ExerciseDetailDto> getExerciseDetailsByLatLong(
            @RequestParam double lat,
            @RequestParam double lot,
            @RequestParam(required = false) String exerciseType) {
        return exerciseDetailService.getDetailsByLatLong(lat, lot, exerciseType);
    }

    // 새로운 /directions 엔드포인트
    @GetMapping("/directions")
    public Map<String, Object> getDirections(
            @RequestParam double originLat,
            @RequestParam double originLng,
            @RequestParam double destLat,
            @RequestParam double destLng,
            @RequestParam(defaultValue = "transit") String mode) {
        return exerciseDetailService.getDirections(originLat, originLng, destLat, destLng, mode);
    }
}