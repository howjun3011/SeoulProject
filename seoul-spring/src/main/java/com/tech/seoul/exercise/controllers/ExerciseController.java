package com.tech.seoul.exercise.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tech.seoul.exercise.models.ExerciseDto;
import com.tech.seoul.exercise.service.ExerciseService;

@RestController
@RequestMapping("/exercise")
public class ExerciseController {

	private final ExerciseService exerciseService;
	
    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }
	
	@GetMapping("/nearby")
	public List<ExerciseDto> getNearbyExercise(
			@RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius,
            @RequestParam String exerciseType) {
		return exerciseService.getNearbyExercise(latitude, longitude, radius, exerciseType);
	}
	
}
