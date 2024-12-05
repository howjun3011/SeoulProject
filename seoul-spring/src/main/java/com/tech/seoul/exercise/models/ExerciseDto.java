package com.tech.seoul.exercise.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ExerciseDto {

	private int exercise_num; 
	private String facility_name;
	private String address; 
	private double latitude;
	private double longitude; 
	private String phone_number;
	private String exercise_type;
	
	
}
