package com.tech.seoul.exercise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tech.seoul.exercise.models.ExerciseDao;
import com.tech.seoul.exercise.models.ExerciseDto;

@Service
public class ExerciseService {
	
	private final ExerciseDao exerciseDao;
	
	public ExerciseService(ExerciseDao exerciseDao) {
        this.exerciseDao = exerciseDao;
    }

	public List<ExerciseDto> getNearbyExercise(double latitude, double longitude, double radius, String exerciseType) {
		return exerciseDao.getExerciseByRadius(latitude, longitude, radius, exerciseType);
	}

}
