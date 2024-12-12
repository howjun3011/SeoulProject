package com.tech.seoul.health.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PharmacyDto {
    private String pharm_id;
    private String pharm_name;
    private String pharm_address;
    private String pharm_pnumber;
    private String pharm_post;
    private Double pharm_lat;
    private Double pharm_lon;
    private String pharm_mon_oc;
    private String pharm_tue_oc;
    private String pharm_wed_oc;
    private String pharm_thu_oc;
    private String pharm_fri_oc;
    private String pharm_sat_oc;
    private String pharm_sun_oc;
    private String pharm_hol_oc;

}
