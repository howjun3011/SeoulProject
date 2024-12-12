package com.tech.seoul.edu.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KidsBringCenterDetailDto {

	private String facility_id;
    private String center_name;
    private String service_type;
    private String age_range;
    private double x_coordinate;
    private double y_coordinate;
    private String address;
    private String start_date;
    private int regular_start_time;
    private int regular_end_time;
    private int vacation_start_time;
    private int vacation_end_time;
    private int discretion_start_time;
    private int discretion_end_time;
    private String saturday_active;
    private int saturday_start_time;
    private int saturday_end_time;
    private int month_price;
    private int day_price;
    private int alltime_max_people;
    private int parttime_max_people;
    private double private_area;
    private String format_regular;
    private String format_vacation;
    private String format_discretion;
    private String format_saturday;
}
