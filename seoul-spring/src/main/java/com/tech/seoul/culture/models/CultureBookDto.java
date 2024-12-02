package com.tech.seoul.culture.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CultureBookDto {
    private String esntl_id;
    private String fclty_nm;
    private String lclas_nm;
    private String mlsfc_nm;
    private String zip_no;
    private String fclty_road_nm_addr;
    private String fclty_la;
    private String fclty_lo;
    private String workday_opn_bsns_time;
    private String workday_clos_time;
    private String sat_opn_bsns_time;
    private String sat_clos_time;
    private String sun_opn_bsns_time;
    private String sun_clos_time;
    private String rstde_opn_bsns_time;
    private String rstde_clos_time;
    private String rstde_guid_cn;
    private String tel_no;
    private String optn_dc;
    private String adit_dc;
}
