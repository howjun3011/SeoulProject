package com.tech.seoul.tour.tourInfoDetail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourInfoDetailRepository extends JpaRepository<TourInfoDetail, String> { // Primary Key 타입 변경

    @Query(value = "SELECT " +
            "t.tour_info_detail_contentid, " +         // row[0] 콘텐츠 ID
            "t.tour_info_detail_title, " +            // row[1] 제목
            "t.tour_info_detail_mapx, " +             // row[2] 지도 X좌표
            "t.tour_info_detail_mapy, " +             // row[3] 지도 Y좌표
            "t.tour_info_detail_cat1, " +             // row[4] 대분류
            "t.tour_info_detail_cat2, " +             // row[5] 중분류
            "t.tour_info_detail_cat3, " +             // row[6] 소분류
            "t.tour_info_detail_firstimage, " +       // row[7] 첫 번째 이미지 URL
            "t.tour_info_detail_tel, " +              // row[8] 전화번호
            "t.tour_info_detail_addr1, " +            // row[9] 주소 1
            "t.tour_info_detail_addr2, " +            // row[10] 주소 2
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_info_detail_mapy)) * " +
            "cos(radians(t.tour_info_detail_mapx) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(t.tour_info_detail_mapy)))) AS distance " + // row[11] 거리 계산
            "FROM tour_info_detail t " +
            "WHERE t.tour_info_detail_mapx IS NOT NULL " +
            "AND t.tour_info_detail_mapy IS NOT NULL " +
            "AND (:cat1 IS NULL OR t.tour_info_detail_cat1 = :cat1) " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}
