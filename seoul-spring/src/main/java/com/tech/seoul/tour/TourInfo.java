package com.tech.seoul.tour;

import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_info")
@Getter
@Setter
public class TourInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_info_id")
    private Integer tourInfoId;

    @Column(name = "tour_info_addr1")
    private String addr1;

    @Column(name = "tour_info_addr2")
    private String addr2;

    @Column(name = "tour_info_areacode")
    private Integer areacode;

    @Column(name = "tour_info_booktour")
    private Integer booktour;

    @Column(name = "tour_info_cat1")
    private String cat1;

    @Column(name = "tour_info_cat2")
    private String cat2;

    @Column(name = "tour_info_cat3")
    private String cat3;

    @Column(name = "tour_info_contentid")
    private Integer contentid;

    @Column(name = "tour_info_contenttypeid")
    private Integer contenttypeid;

    @Column(name = "tour_info_createdtime")
    private LocalDateTime createdtime;

    @Column(name = "tour_info_firstimage")
    private String firstimage;

    @Column(name = "tour_info_firstimage2")
    private String firstimage2;

    @Column(name = "tour_info_cpyrht_div_cd")
    private String cpyrhtDivCd;

    @Column(name = "tour_info_mapx")
    private Double mapX;

    @Column(name = "tour_info_mapy")
    private Double mapY;

    @Column(name = "tour_info_mlevel")
    private Integer mlevel;

    @Column(name = "tour_info_modifiedtime")
    private LocalDateTime modifiedtime;

    @Column(name = "tour_info_sigungucode")
    private Integer sigungucode;

    @Column(name = "tour_info_tel")
    private String tel;

    @Column(name = "tour_info_title")
    private String title;

    @Column(name = "tour_info_zipcode")
    private String zipcode;

    // 필요한 경우 생성자나 기타 메서드를 추가하세요.
}
