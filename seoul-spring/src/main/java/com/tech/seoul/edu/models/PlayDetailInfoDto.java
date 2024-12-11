package com.tech.seoul.edu.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayDetailInfoDto {
	private String facility_name;
    private double x_coordinate;
    private double y_coordinate;
    private String address;
    private String address_detail;
    private String start_date;
    private String tel;
    private String free_price;
    private String open_day;
    private String break_day;
    private String age_range;
}
