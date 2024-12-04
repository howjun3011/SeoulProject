package com.tech.seoul.health.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class HospitalDto {
    private String hosp_id;
    private String hosp_name;
    private String hosp_address;
    private String hosp_simple_address;
    private String hosp_type_eng;
    private String hosp_type;
    private String hosp_pnumber;
    private String hosp_lunchtime;
    private String hosp_location;
    private String hosp_post;
    private Double hosp_lat;
    private Double hosp_lon;
    private String hosp_sbj;
    private List<String> hosp_sbj_list;
    private String hosp_mon_oc;
    private String hosp_tue_oc;
    private String hosp_wed_oc;
    private String hosp_thu_oc;
    private String hosp_fri_oc;
    private String hosp_sat_oc;
    private String hosp_sun_oc;
    private String hosp_hol_oc;

}
