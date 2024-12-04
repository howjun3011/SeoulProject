package com.tech.seoul.culture.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CultureBestsellerDto {
    private int seq_no;
    private int rank_co;
    private String inpt_de;
    private String isbn_ten_no;
    private String isbn_thirteen_no;
    private String book_title_nm;
    private String authr_nm;
    private String book_intrcn_cn;
    private String publisher_nm;
    private String pblicte_de;
    private String book_cvr_image_nm;
    private String book_mastr_seq_no;
    private String kdc_nm;
}
