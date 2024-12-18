package com.tech.seoul.exercise.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.tech.seoul.exercise.models.ExerciseDetailDao;
import com.tech.seoul.exercise.models.ExerciseDetailDto;

@Service
public class ExerciseDetailService {
    private final ExerciseDetailDao exerciseDetailDao;
    private final RestTemplate restTemplate;

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    public ExerciseDetailService(ExerciseDetailDao exerciseDetailDao) {
        this.exerciseDetailDao = exerciseDetailDao;
        this.restTemplate = new RestTemplate();
    }

    public List<ExerciseDetailDto> getNearbyDetails(double latitude, double longitude, double radius, String exerciseType) {
        return exerciseDetailDao.getExerciseDetailByRadius(latitude, longitude, radius, exerciseType == null ? "" : exerciseType);
    }

    public List<ExerciseDetailDto> getDetailsByLatLong(double lat, double lot, String exerciseType) {
        return exerciseDetailDao.getExerciseDetailByLatLong(lat, lot, exerciseType == null ? "" : exerciseType);
    }

    public Map<String, Object> getDirections(double originLat, double originLng, double destLat, double destLng, String mode) {
        String url = String.format(
                "https://maps.googleapis.com/maps/api/directions/json?origin=%f,%f&destination=%f,%f&mode=%s&language=ko&key=%s",
                originLat, originLng, destLat, destLng, mode, googleMapsApiKey);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return response;
    }
}