package com.tech.seoul.tour.tourFestival;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TourFestivalService {

    @Autowired
    private TourFestivalRepository tourFestivalRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public List<TourFestivalDTO> getNearbyFestivals(double latitude, double longitude, double radius, String cat1) {
        List<Object[]> results = tourFestivalRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);
        List<TourFestivalDTO> festivals = new ArrayList<>();

        for (Object[] row : results) {
            TourFestivalDTO dto = new TourFestivalDTO();
            try {
                dto.setTourFestivalId(((Number) row[0]).intValue());
                dto.setTitle((String) row[1]);
                dto.setMapX(((Number) row[2]).doubleValue());
                dto.setMapY(((Number) row[3]).doubleValue());
                dto.setCat1((String) row[4]);
                dto.setCat2((String) row[5]);
                dto.setCat3((String) row[6]);
                dto.setFirstimage((String) row[7]);

                // 이벤트 시작 날짜 처리
                Object eventStartDateObj = row[8];
                if (eventStartDateObj != null) {
                    if (eventStartDateObj instanceof java.sql.Date) {
                        java.sql.Date date = (java.sql.Date) eventStartDateObj;
                        dto.setEventStartDate(date.toLocalDate().format(DATE_FORMATTER));
                    } else if (eventStartDateObj instanceof java.sql.Timestamp) {
                        java.sql.Timestamp timestamp = (java.sql.Timestamp) eventStartDateObj;
                        dto.setEventStartDate(timestamp.toLocalDateTime().toLocalDate().format(DATE_FORMATTER));
                    } else {
                        dto.setEventStartDate(eventStartDateObj.toString());
                    }
                } else {
                    dto.setEventStartDate(null);
                }

                // 이벤트 종료 날짜 처리
                Object eventEndDateObj = row[9];
                if (eventEndDateObj != null) {
                    if (eventEndDateObj instanceof java.sql.Date) {
                        java.sql.Date date = (java.sql.Date) eventEndDateObj;
                        dto.setEventEndDate(date.toLocalDate().format(DATE_FORMATTER));
                    } else if (eventEndDateObj instanceof java.sql.Timestamp) {
                        java.sql.Timestamp timestamp = (java.sql.Timestamp) eventEndDateObj;
                        dto.setEventEndDate(timestamp.toLocalDateTime().toLocalDate().format(DATE_FORMATTER));
                    } else {
                        dto.setEventEndDate(eventEndDateObj.toString());
                    }
                } else {
                    dto.setEventEndDate(null);
                }

                // 전화번호 처리
                dto.setTel(row[10] != null ? row[10].toString() : null);

                // 주소 처리
                dto.setAddr1(row[11] != null ? row[11].toString() : null);
                dto.setAddr2(row[12] != null ? row[12].toString() : null);

                // 거리 처리
                dto.setDistance(row[13] != null ? ((Number) row[13]).doubleValue() : null);

                festivals.add(dto);
            } catch (ClassCastException e) {
                System.err.println("Error casting row elements: " + e.getMessage());
                // 추가적인 로깅 또는 예외 처리 로직을 여기에 추가할 수 있습니다.
            }
        }

        return festivals;
    }
}
