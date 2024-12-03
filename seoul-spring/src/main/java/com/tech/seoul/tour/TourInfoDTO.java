// TourInfoDTO.java
package com.tech.seoul.tour;

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
}
