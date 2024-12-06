package com.tech.seoul.exercise.models;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ExerciseDao {
	public List<ExerciseDto> getExercise(String exerciseType);

	public List<ExerciseDto> getExerciseByRadius(@Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("exerciseType") String exerciseType);
}
