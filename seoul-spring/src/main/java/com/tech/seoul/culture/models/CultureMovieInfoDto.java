package com.tech.seoul.culture.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CultureMovieInfoDto {
    private String movie_id;
    private String lclas_nm;
    private String mlsfc_nm;
    private String poi_nm;
    private String bhf_nm;
    private String asstn_nm;
    private String cl_nm;
    private String ctprvn_nm;
    private String signgu_nm;
    private String rdnmadr_nm;
    private String buld_no;
    private String lc_lo;
    private String lc_la;
    private String origin_nm;
}
