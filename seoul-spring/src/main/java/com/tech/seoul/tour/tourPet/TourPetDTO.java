package com.tech.seoul.tour.tourPet;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TourPetDTO {

    private Integer tourPetId;          // 고유 ID
    private String addr1;               // 주소 1
    private String addr2;               // 주소 2
    private String areacode;            // 지역 코드 (수정됨)
    private String cat1;                // 대분류
    private String cat2;                // 중분류
    private String cat3;                // 소분류
    private String contentid;           // 고유 콘텐츠 ID (수정됨)
    private String contenttypeid;       // 콘텐츠 타입 ID (수정됨)
    private LocalDateTime createdtime;  // 생성 시간
    private String firstimage;          // 첫 번째 이미지 URL
    private String firstimage2;         // 두 번째 이미지 URL
    private String cpyrhtDivCd;         // 저작권 구분 코드
    private Double mapx;                // 지도 X좌표
    private Double mapy;                // 지도 Y좌표
    private String mlevel;              // 지도 수준 (수정됨)
    private LocalDateTime modifiedtime; // 수정 시간
    private String sigungucode;         // 시군구 코드 (수정됨)
    private String tel;                 // 전화번호
    private String title;               // 제목
    private String zipcode;             // 우편번호
    private Double distance;            // 거리
}
