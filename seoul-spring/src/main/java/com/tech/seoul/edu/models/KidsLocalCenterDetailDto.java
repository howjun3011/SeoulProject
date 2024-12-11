package com.tech.seoul.edu.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KidsLocalCenterDetailDto {

	private String center_name;
    private String cu_name;
    private String age_range;
    private double x_coordinate;
    private double y_coordinate;
    private String address;
    private String tel;
    private int price;
    private int regular_start_time;
    private int regular_end_time;
    private int vacation_start_time;
    private int vacation_end_time;
    private String saturday_active;
    private int saturday_start_time;
    private int saturday_end_time;
    private String format_regular;
    private String format_vacation;
    private String format_saturday;
}
