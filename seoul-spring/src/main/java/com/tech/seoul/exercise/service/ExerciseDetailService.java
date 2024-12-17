package com.tech.seoul.exercise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tech.seoul.exercise.models.ExerciseDetailDao;
import com.tech.seoul.exercise.models.ExerciseDetailDto;

@Service
public class ExerciseDetailService {
    private final ExerciseDetailDao exerciseDetailDao;

    public ExerciseDetailService(ExerciseDetailDao exerciseDetailDao) {
        this.exerciseDetailDao = exerciseDetailDao;
    }

    public List<ExerciseDetailDto> getNearbyDetails(double latitude, double longitude, double radius, String exerciseType) {
        return exerciseDetailDao.getExerciseDetailByRadius(latitude, longitude, radius, exerciseType == null ? "" : exerciseType);
    }

    public List<ExerciseDetailDto> getDetailsByLatLong(double lat, double lot, String exerciseType) {
        return exerciseDetailDao.getExerciseDetailByLatLong(lat, lot, exerciseType == null ? "" : exerciseType);
    }
}