package com.tech.seoul.tour.tourFestival;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TourFestivalDTO {
    private Integer tourFestivalId;
    private String title;
    private Double mapX;
    private Double mapY;
    private String cat1;
    private String cat2;
    private String cat3;
    private String firstimage; // 이미지 URL
    private Double distance;
    private String eventStartDate; // 이벤트 시작 날짜
    private String eventEndDate;   // 이벤트 종료 날짜
    private String tel;            // 전화번호
    private String addr1;          // 주소 1
    private String addr2;          // 주소 2 (옵션)
}

