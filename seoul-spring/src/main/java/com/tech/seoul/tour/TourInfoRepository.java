package com.tech.seoul.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// TourInfoRepository.java
public interface TourInfoRepository extends JpaRepository<TourInfo, Integer> {

    @Query(value = "SELECT t.tour_info_id, t.tour_info_title, t.tour_info_mapx, t.tour_info_mapy, t.tour_info_cat1, (6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_info_mapy)) * cos(radians(t.tour_info_mapx) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(t.tour_info_mapy)))) AS distance FROM tour_info t WHERE t.tour_info_mapx IS NOT NULL AND t.tour_info_mapy IS NOT NULL AND (:cat1 IS NULL OR t.tour_info_cat1 = :cat1) HAVING distance < :radius ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}


