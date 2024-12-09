package com.tech.seoul.tour.tourPet;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_pet")
@Getter
@Setter
public class TourPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_pet_id")
    private Integer tourPetId;

    @Column(name = "tour_pet_addr1")
    private String addr1;

    @Column(name = "tour_pet_addr2")
    private String addr2;

    @Column(name = "tour_pet_areacode")
    private Integer areacode;

    @Column(name = "tour_pet_cat1")
    private String cat1;

    @Column(name = "tour_pet_cat2")
    private String cat2;

    @Column(name = "tour_pet_cat3")
    private String cat3;

    @Column(name = "tour_pet_contentid")
    private Integer contentid;

    @Column(name = "tour_pet_contenttypeid")
    private Integer contenttypeid;

    @Column(name = "tour_pet_createdtime")
    private LocalDateTime createdtime;

    @Column(name = "tour_pet_firstimage")
    private String firstimage;

    @Column(name = "tour_pet_firstimage2")
    private String firstimage2;

    @Column(name = "tour_pet_cpyrhtDivCd")
    private String cpyrhtDivCd;

    @Column(name = "tour_pet_mapx")
    private Double mapx;

    @Column(name = "tour_pet_mapy")
    private Double mapy;

    @Column(name = "tour_pet_mlevel")
    private Integer mlevel;

    @Column(name = "tour_pet_modifiedtime")
    private LocalDateTime modifiedtime;

    @Column(name = "tour_pet_sigungucode")
    private Integer sigungucode;

    @Column(name = "tour_pet_tel")
    private String tel;

    @Column(name = "tour_pet_title")
    private String title;

    @Column(name = "tour_pet_zipcode")
    private String zipcode;
}
