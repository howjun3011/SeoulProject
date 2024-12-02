package com.tech.seoul.tour.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TourService {

    private final String API_KEY = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
    private final String BASE_URL = "https://apis.data.go.kr/B551011/KorService1/searchKeyword1";

    public String getTourInfo(String keyword) {
        String url = BASE_URL
                + "?numOfRows=10"
                + "&pageNo=1"
                + "&MobileOS=ETC"
                + "&MobileApp=AppTest"
                + "&_type=json"
                + "&listYN=Y"
                + "&keyword=" + keyword
                + "&areaCode=1"
                + "&serviceKey=" + API_KEY;

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class); // JSON 응답 그대로 반환
    }
}