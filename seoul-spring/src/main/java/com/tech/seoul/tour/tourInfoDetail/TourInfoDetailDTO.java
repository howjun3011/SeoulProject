// TourInfoDetailDTO.java
package com.tech.seoul.tour.tourInfoDetail;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourInfoDetailDTO {

    private String contentid;       // 고유 콘텐츠 ID
    private String contenttypeid;   // 콘텐츠 타입 ID
    private String title;           // 제목
    private String addr1;           // 주소 1
    private String addr2;           // 주소 2
    private String tel;             // 전화번호
    private String zipcode;         // 우편번호
    private String cat1;            // 대분류
    private String cat2;            // 중분류
    private String cat3;            // 소분류
    private Double mapx;            // 지도 X좌표
    private Double mapy;            // 지도 Y좌표
    private String firstimage;      // 첫 번째 이미지 URL
    private String firstimage2;     // 두 번째 이미지 URL
    private String overview;        // 개요 설명
    private Double distance;        // 거리 (추가 필드, 계산용)
}
