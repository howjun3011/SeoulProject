package com.tech.seoul.tour.tourPet;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface TourPetRepository extends JpaRepository<TourPet, Integer> {

    @Query(value = "SELECT " +
            "t.tour_pet_id, " +                  // row[0] 고유 ID
            "t.tour_pet_addr1, " +               // row[1] 주소 1
            "t.tour_pet_addr2, " +               // row[2] 주소 2
            "t.tour_pet_areacode, " +             // row[3] 지역 코드
            "t.tour_pet_cat1, " +                 // row[4] 대분류
            "t.tour_pet_cat2, " +                 // row[5] 중분류
            "t.tour_pet_cat3, " +                 // row[6] 소분류
            "t.tour_pet_contentid, " +            // row[7] 콘텐츠 ID
            "t.tour_pet_contenttypeid, " +        // row[8] 콘텐츠 타입 ID
            "t.tour_pet_createdtime, " +          // row[9] 생성 시간
            "t.tour_pet_firstimage, " +           // row[10] 첫 번째 이미지 URL
            "t.tour_pet_firstimage2, " +          // row[11] 두 번째 이미지 URL
            "t.tour_pet_cpyrhtDivCd, " +          // row[12] 저작권 구분 코드
            "t.tour_pet_mapx, " +                 // row[13] 지도 X좌표
            "t.tour_pet_mapy, " +                 // row[14] 지도 Y좌표
            "t.tour_pet_mlevel, " +               // row[15] 지도 수준
            "t.tour_pet_modifiedtime, " +         // row[16] 수정 시간
            "t.tour_pet_sigungucode, " +          // row[17] 시군구 코드
            "t.tour_pet_tel, " +                  // row[18] 전화번호
            "t.tour_pet_title, " +                // row[19] 제목
            "t.tour_pet_zipcode, " +              // row[20] 우편번호
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_pet_mapy)) * " +
            "cos(radians(t.tour_pet_mapx) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(t.tour_pet_mapy)))) AS distance " + // row[21] 거리 계산
            "FROM tour_pet t " +
            "WHERE t.tour_pet_mapx IS NOT NULL " +
            "AND t.tour_pet_mapy IS NOT NULL " +
            "AND (:cat1 IS NULL OR t.tour_pet_cat1 = :cat1) " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}
