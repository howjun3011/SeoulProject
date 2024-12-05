package com.tech.seoul.tour.tourInfoDetail;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_info_detail")
@Getter
@Setter
public class TourInfoDetail {

    @Id
    @Column(name = "tour_info_detail_contentid", length = 20)
    private String tourInfoDetailcontentid; // 고유 콘텐츠 ID

    @Column(name = "tour_info_detail_contenttypeid", length = 10)
    private String contenttypeid; // 콘텐츠 타입 ID

    @Column(name = "tour_info_detail_title", length = 255)
    private String title; // 제목

    @Column(name = "tour_info_detail_createdtime")
    private LocalDateTime createdtime; // 생성 시간

    @Column(name = "tour_info_detail_modifiedtime")
    private LocalDateTime modifiedtime; // 수정 시간

    @Column(name = "tour_info_detail_tel", length = 50)
    private String tel; // 전화번호

    @Column(name = "tour_info_detail_telname", length = 100)
    private String telname; // 전화 이름

    @Column(name = "tour_info_detail_homepage", columnDefinition = "TEXT")
    private String homepage; // 홈페이지 URL

    @Column(name = "tour_info_detail_booktour", length = 50)
    private String booktour; // 예약 가능 여부

    @Column(name = "tour_info_detail_firstimage", columnDefinition = "TEXT")
    private String firstimage; // 첫 번째 이미지 URL

    @Column(name = "tour_info_detail_firstimage2", columnDefinition = "TEXT")
    private String firstimage2; // 두 번째 이미지 URL

    @Column(name = "tour_info_detail_cpyrhtDivCd", length = 10)
    private String cpyrhtDivCd; // 저작권 구분 코드

    @Column(name = "tour_info_detail_areacode", length = 10)
    private String areacode; // 지역 코드

    @Column(name = "tour_info_detail_sigungucode", length = 10)
    private String sigungucode; // 시군구 코드

    @Column(name = "tour_info_detail_cat1", length = 10)
    private String cat1; // 대분류

    @Column(name = "tour_info_detail_cat2", length = 10)
    private String cat2; // 중분류

    @Column(name = "tour_info_detail_cat3", length = 10)
    private String cat3; // 소분류

    @Column(name = "tour_info_detail_addr1", length = 255)
    private String addr1; // 주소 1

    @Column(name = "tour_info_detail_addr2", length = 255)
    private String addr2; // 주소 2

    @Column(name = "tour_info_detail_zipcode", length = 10)
    private String zipcode; // 우편번호

    @Column(name = "tour_info_detail_mapx")
    private Double mapx; // 지도 X좌표

    @Column(name = "tour_info_detail_mapy")
    private Double mapy; // 지도 Y좌표

    @Column(name = "tour_info_detail_mlevel")
    private Integer mlevel; // 지도 레벨

    @Column(name = "tour_info_detail_overview", columnDefinition = "TEXT")
    private String overview; // 개요 설명
}
