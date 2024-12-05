package com.tech.seoul.culture.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CultureBookLibraryDto {
    private int lbrry_cd;
    private String lbrry_nm;
    private String lbrry_addr;
    private String lbrry_la;
    private String lbrry_lo;
    private String lbrry_no;
    private String tel_no;
    private String fax_no;
    private String hmpg_value;
    private String opnng_time;
    private String closedon_dc;
    private String lbrry_ty_nm;
    private String fond_mby_value;
    private String opnng_year;
    private String zip_no;
    private String lbrry_ncm_nm;
    private String reprsnt_at;
}
