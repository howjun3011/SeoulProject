package com.tech.seoul.exercise.models;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ExerciseDetailDao {
    List<ExerciseDetailDto> getExerciseDetailByRadius(
        @Param("latitude") double latitude,
        @Param("longitude") double longitude,
        @Param("radius") double radius,
        @Param("exerciseType") String exerciseType
    );

    List<ExerciseDetailDto> getExerciseDetailByLatLong(
        @Param("lat") double lat,
        @Param("lot") double lot,
        @Param("exerciseType") String exerciseType
    );
}