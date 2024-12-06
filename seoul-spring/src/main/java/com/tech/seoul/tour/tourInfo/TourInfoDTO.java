// TourInfoDTO.java
package com.tech.seoul.tour.tourInfo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TourInfoDTO {
    private Integer tourInfoId;
    private String title;
    private Double mapX;
    private Double mapY;
    private String cat1;
    private String cat2;
    private String cat3;
    private String imageUrl; // 이미지 URL 필드 추가
    private Double distance;
    private String tel;            // 전화번호
    private String addr1;          // 주소 1
    private String addr2;          // 주소 2 (옵션)
    private Integer contentid;
    private Integer contenttypeid;
}
