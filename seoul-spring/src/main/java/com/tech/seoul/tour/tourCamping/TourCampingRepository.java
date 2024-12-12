// TourCampingRepository.java
package com.tech.seoul.tour.tourCamping;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourCampingRepository extends JpaRepository<TourCamping, Integer> {

    @Query(value = "SELECT " +
            "t.tour_camping_id, " +           // row[0]
            "t.tour_camping_faclt_nm, " +     // row[1] - 시설명
            "t.tour_camping_line_intro, " +   // row[2] - 한줄소개
            "t.tour_camping_intro, " +        // row[3] - 상세소개
            "t.tour_camping_allar, " +        // row[4] - 전체 면적
            "t.tour_camping_insrnc_at, " +    // row[5] - 보험 여부
            "t.tour_camping_trsagnt_no, " +   // row[6] - 여행사 번호
            "t.tour_camping_bizrno, " +       // row[7] - 사업자 번호
            "t.tour_camping_faclt_div_nm, " + // row[8] - 시설 구분명
            "t.tour_camping_mange_div_nm, " + // row[9] - 관리 구분명
            "t.tour_camping_manage_sttus, " + // row[10] - 관리 상태
            "t.tour_camping_hvof_bgnde, " +   // row[11] - 휴장 시작일
            "t.tour_camping_hvof_enddle, " +  // row[12] - 휴장 종료일
            "t.tour_camping_feature_nm, " +   // row[13] - 특징
            "t.tour_camping_induty, " +       // row[14] - 업종
            "t.tour_camping_lct_cl, " +       // row[15] - 위치 분류
            "t.tour_camping_do_nm, " +        // row[16] - 도명
            "t.tour_camping_sigungu_nm, " +   // row[17] - 시군구명
            "t.tour_camping_zipcode, " +      // row[18] - 우편번호
            "t.tour_camping_addr1, " +        // row[19] - 주소 1
            "t.tour_camping_addr2, " +        // row[20] - 주소 2
            "t.tour_camping_mapx, " +         // row[21] - 지도 X좌표
            "t.tour_camping_mapy, " +         // row[22] - 지도 Y좌표
            "t.tour_camping_direction, " +    // row[23] - 오시는 길
            "t.tour_camping_tel, " +          // row[24] - 전화번호
            "t.tour_camping_homepage, " +     // row[25] - 홈페이지
            "t.tour_camping_resve_url, " +    // row[26] - 예약 URL
            "t.tour_camping_resve_cl, " +     // row[27] - 예약 구분
            "t.tour_camping_manage_nmpr, " +  // row[28] - 관리 인원
            "t.tour_camping_gnrl_site_co, " + // row[29] - 일반 사이트 수
            "t.tour_camping_auto_site_co, " + // row[30] - 자동차 사이트 수
            "t.tour_camping_glamp_site_co, " +// row[31] - 글램핑 사이트 수
            "t.tour_camping_carav_site_co, " +// row[32] - 카라반 사이트 수
            "t.tour_camping_indvdl_carav_site_co, " + // row[33] - 개인 카라반 사이트 수
            "t.tour_camping_sited_stnc, " +   // row[34] - 사이트 간 거리
            "t.tour_camping_site_mg1_width, " + // row[35]
            "t.tour_camping_site_mg2_width, " + // row[36]
            "t.tour_camping_site_mg3_width, " + // row[37]
            "t.tour_camping_site_mg1_vrticl, " + // row[38]
            "t.tour_camping_site_mg2_vrticl, " + // row[39]
            "t.tour_camping_site_mg3_vrticl, " + // row[40]
            "t.tour_camping_site_mg1_co, " +    // row[41]
            "t.tour_camping_site_mg2_co, " +    // row[42]
            "t.tour_camping_site_mg3_co, " +    // row[43]
            "t.tour_camping_site_bottom_cl1, " + // row[44]
            "t.tour_camping_site_bottom_cl2, " + // row[45]
            "t.tour_camping_site_bottom_cl3, " + // row[46]
            "t.tour_camping_site_bottom_cl4, " + // row[47]
            "t.tour_camping_site_bottom_cl5, " + // row[48]
            "t.tour_camping_tooltip, " +       // row[49]
            "t.tour_camping_glamp_inner_fclty, " + // row[50]
            "t.tour_camping_carav_inner_fclty, " + // row[51]
            "t.tour_camping_prmisn_de, " +     // row[52]
            "t.tour_camping_oper_pd_cl, " +    // row[53]
            "t.tour_camping_oper_de_cl, " +    // row[54]
            "t.tour_camping_trler_acmpny_at, " + // row[55]
            "t.tour_camping_carav_acmpny_at, " + // row[56]
            "t.tour_camping_toilet_co, " +     // row[57]
            "t.tour_camping_swrm_co, " +       // row[58]
            "t.tour_camping_wtrpl_co, " +      // row[59]
            "t.tour_camping_brazier_cl, " +    // row[60]
            "t.tour_camping_sbrs_cl, " +       // row[61]
            "t.tour_camping_sbrs_etc, " +      // row[62]
            "t.tour_camping_posbl_fclty_cl, " +// row[63]
            "t.tour_camping_posbl_fclty_etc, " +// row[64]
            "t.tour_camping_cltur_event_at, " +// row[65]
            "t.tour_camping_cltur_event, " +   // row[66]
            "t.tour_camping_exprn_progrm_at, " + // row[67]
            "t.tour_camping_exprn_progrm, " +  // row[68]
            "t.tour_camping_extshr_co, " +     // row[69]
            "t.tour_camping_frprvt_wrpp_co, " + // row[70]
            "t.tour_camping_frprvt_sand_co, " +// row[71]
            "t.tour_camping_fire_sensor_co, " +// row[72]
            "t.tour_camping_thema_envrn_cl, " +// row[73]
            "t.tour_camping_eqpmn_lend_cl, " + // row[74]
            "t.tour_camping_animal_cmg_cl, " + // row[75]
            "t.tour_camping_tour_era_cl, " +   // row[76]
            "t.tour_camping_firstimageurl, " + // row[77] (이미지 URL)
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(t.tour_camping_mapy)) * " +
            "cos(radians(t.tour_camping_mapx) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(t.tour_camping_mapy)))) AS distance " + // row[78]
            "FROM tour_camping t " +
            "WHERE t.tour_camping_mapx IS NOT NULL " +
            "AND t.tour_camping_mapy IS NOT NULL " +
            "AND (:cat1 IS NULL OR t.tour_camping_cat1 = :cat1) " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Object[]> findByLocationAndCategory(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius,
            @Param("cat1") String cat1
    );
}
