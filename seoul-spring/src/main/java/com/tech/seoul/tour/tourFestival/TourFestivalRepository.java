package com.tech.seoul.tour.tourFestival;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourFestivalRepository extends JpaRepository<TourFestival, Integer> {

    @Query(value = "SELECT " +
            "t.tour_festival_id, " +
            "t.tour_festival_title, " +
            "t.tour_festival_mapx, " +
            "t.tour_festival_mapy, " +
            "t.tour_festival_cat1, " +
            "t.tour_festival_cat2, " +
            "t.tour_festival_cat3, " +
            "t.tour_festival_firstimage, " +
            "DATE_FORMAT(t.tour_festival_eventstartdate, '%Y-%m-%d') AS eventStartDate, " +
            "DATE_FORMAT(t.tour_festival_eventenddate, '%Y-%m-%d') AS eventEndDate, " +
            "t.tour_festival_tel, " +
            "t.tour_festival_addr1, " + // addr1 추가
            "t.tour_festival_addr2, " + // addr2 추가
            "t.tour_festival_contentid, " +
            "t.tour_festival_contenttypeid, " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_festival_mapy)) * " +
            "cos(radians(t.tour_festival_mapx) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(t.tour_festival_mapy)))) AS distance " +
            "FROM tour_festival t " +
            "WHERE t.tour_festival_mapx IS NOT NULL " +
            "AND t.tour_festival_mapy IS NOT NULL " +
            "AND (:cat1 IS NULL OR t.tour_festival_cat1 = :cat1) " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}
