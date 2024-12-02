package com.tech.seoul.tour.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tour_info")

@Getter
@Setter
public class TourInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String addr1;
    private String addr2;
    private int areacode;
    private boolean booktour;
    private String cat1;
    private String cat2;
    private String cat3;
    private int contentid;
    private int contenttypeid;
    private LocalDateTime createdtime;
    private String firstimage;
    private String firstimage2;
    private String cpyrhtDivCd;
    private double mapx;
    private double mapy;
    private int mlevel;
    private LocalDateTime modifiedtime;
    private int sigungucode;
    private String tel;
    private String title;
}
