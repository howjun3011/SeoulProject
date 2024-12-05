package com.tech.seoul.tour.tourFestival;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_festival")
@Getter
@Setter
public class TourFestival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_festival_id")
    private Integer tourFestivalId;

    @Column(name = "tour_festival_addr1")
    private String addr1;

    @Column(name = "tour_festival_addr2")
    private String addr2;

    @Column(name = "tour_festival_booktour")
    private String booktour;

    @Column(name = "tour_festival_cat1")
    private String cat1;

    @Column(name = "tour_festival_cat2")
    private String cat2;

    @Column(name = "tour_festival_cat3")
    private String cat3;

    @Column(name = "tour_festival_contentid")
    private Integer contentid;

    @Column(name = "tour_festival_contenttypeid")
    private Integer contenttypeid;

    @Column(name = "tour_festival_createdtime")
    private LocalDateTime createdtime;

    @Column(name = "tour_festival_eventstartdate")
    private LocalDateTime eventstartdate;

    @Column(name = "tour_festival_eventenddate")
    private LocalDateTime eventenddate;

    @Column(name = "tour_festival_firstimage")
    private String firstimage;

    @Column(name = "tour_festival_firstimage2")
    private String firstimage2;

    @Column(name = "tour_festival_cpyrhtDivCd")
    private String cpyrhtDivCd;

    @Column(name = "tour_festival_mapx")
    private Double mapx;

    @Column(name = "tour_festival_mapy")
    private Double mapy;

    @Column(name = "tour_festival_mlevel")
    private Integer mlevel;

    @Column(name = "tour_festival_modifiedtime")
    private LocalDateTime modifiedtime;

    @Column(name = "tour_festival_areacode")
    private Integer areacode;

    @Column(name = "tour_festival_sigungucode")
    private Integer sigungucode;

    @Column(name = "tour_festival_tel")
    private String tel;

    @Column(name = "tour_festival_title")
    private String title;
}
