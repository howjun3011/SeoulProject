// TourInfoRepository.java
package com.tech.seoul.tour.tourInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourInfoRepository extends JpaRepository<TourInfo, Integer> {

    @Query(value = "SELECT " +
            "t.tour_info_id, " +             // row[0]
            "t.tour_info_title, " +          // row[1]
            "t.tour_info_mapx, " +           // row[2]
            "t.tour_info_mapy, " +           // row[3]
            "t.tour_info_cat1, " +           // row[4]
            "t.tour_info_cat2, " +           // row[5]
            "t.tour_info_cat3, " +           // row[6]
            "t.tour_info_firstimage, " +     // row[7] (이미지 URL)
            "t.tour_info_tel, " +   // row[8]
            "t.tour_info_addr1, " + // addr1 추가 row[9]
            "t.tour_info_addr2, " + // addr2 추가 row[10]
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_info_mapy)) * " +
            "cos(radians(t.tour_info_mapx) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(t.tour_info_mapy)))) AS distance " + // row[11]
            "FROM tour_info t " +
            "WHERE t.tour_info_mapx IS NOT NULL " +
            "AND t.tour_info_mapy IS NOT NULL " +
            "AND (:cat1 IS NULL OR t.tour_info_cat1 = :cat1) " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}
