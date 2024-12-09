package com.tech.seoul.edu.models;

import lombok.Getter;

@Getter
public class KinderDetailInfoDto {
	// 공통 필드 (모든 테이블에 존재)
    private String office_education;
    private String kindergarten_name;
    private String kindergarten_type;
    private String address;

    // kids_classroom_area 테이블 필드
    private int classroom_count;
    private int area_classroom;
    private int area_gym;
    private int area_clean;
    private int area_cook;
    private int area_etc;

    // kids_school_meals 테이블 필드
    private String management_method;
    private String management_company;
    private int students_total_count;
    private int students_meals_count;
    private String dietitian_check;
    private int dietitian_single_count;
    private int dietitian_multi_count;
    private String dietitian_multi_name;
    private int chef_count;
    private int cook_count;
    private String catering_report_check;

    // kids_after_school 테이블 필드
    private String start_time;
    private String end_time;
    private int class_independent_count;
    private int class_afternoon_count;
    private int class_total_count;
    private int students_independent_count;
    private int students_afternoon_count;
    private int students_total_count_after_school;
    private int teacher_regular_count;
    private int teacher_temporary_count;
    private int teacher_dedicated_count;
    private int teacher_total_count;

    // kids_safety_inspection 테이블 필드
    private String play_goods_check;
    private String play_goods_check_date;
    private String play_goods_check_result;
    private String cctv_have;
    private String cctv_in;
    private String cctv_out;
    private String cctv_total;

    // kids_car 테이블 필드
    private String car_check;
    private int car_active_total_count;
    private int car_report_total_count;
    private int car_9;
    private int car_12;
    private int car_15;

    // kids_normal_now 테이블 필드
    private String hearder;
    private String director;
    private String birth;
    private String start;
    private String tel;
    private String home_page;
    private String operating_hours;
    private int class_count_3;
    private int class_count_4;
    private int class_count_5;
    private int class_count_mix;
    private int class_count_special;
    private int students_max_total;
    private int students_max_3;
    private int students_max_4;
    private int students_max_5;
    private int students_max_mix;
    private int students_max_special;
    private int students_now_3;
    private int students_now_4;
    private int students_now_5;
    private int students_now_mix;
    private int students_now_special;
    
    //교사수
    private int total_teacher_count;

    // 공통 필드 (위치 정보)
    private double y_coordinate;
    private double x_coordinate;
}
