package com.tech.seoul.exercise.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ExerciseDetailDto {

	private String addr;
	private String instUrlAddr; 
	private double lat;
	private double lot; 
	private String imgFileUrlAddr;
	private String rsrcNm;
}
