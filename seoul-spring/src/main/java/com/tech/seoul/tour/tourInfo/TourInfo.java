package com.tech.seoul.tour.tourInfo;

import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * TourInfo 엔티티는 데이터베이스의 "tour_info" 테이블과 매핑되는 JPA 엔티티입니다.
 * 이 클래스는 서울시 내 관광지 정보에 대한 다양한 속성을 포함하고 있으며,
 * Lombok을 사용하여 Getter와 Setter 메서드를 자동으로 생성합니다.
 */
@Entity
@Table(name = "tour_info") // 데이터베이스의 "tour_info" 테이블과 매핑
@Getter // Lombok을 사용하여 모든 필드에 대한 Getter 생성
@Setter // Lombok을 사용하여 모든 필드에 대한 Setter 생성
public class TourInfo {

    /**
     * tourInfoId는 테이블의 기본 키(primary key)로 사용됩니다.
     * @Id: 이 필드가 엔티티의 기본 키임을 나타냅니다.
     * @GeneratedValue: 기본 키의 값을 자동으로 생성하도록 설정.
     * strategy = GenerationType.IDENTITY: 데이터베이스의 기본 키 생성을 따름 (예: AUTO_INCREMENT).
     * @Column: 테이블의 "tour_info_id" 열과 매핑.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_info_id")
    private Integer tourInfoId;

    /**
     * addr1는 관광지의 첫 번째 주소를 나타냅니다.
     * @Column: 테이블의 "tour_info_addr1" 열과 매핑.
     */
    @Column(name = "tour_info_addr1")
    private String addr1;

    /**
     * addr2는 관광지의 두 번째 주소를 나타냅니다.
     * @Column: 테이블의 "tour_info_addr2" 열과 매핑.
     */
    @Column(name = "tour_info_addr2")
    private String addr2;

    /**
     * areacode는 관광지의 지역 코드를 나타냅니다.
     * @Column: 테이블의 "tour_info_areacode" 열과 매핑.
     */
    @Column(name = "tour_info_areacode")
    private Integer areacode;

    /**
     * booktour는 예약 가능한 관광지인지 여부를 나타내는 코드입니다.
     * @Column: 테이블의 "tour_info_booktour" 열과 매핑.
     */
    @Column(name = "tour_info_booktour")
    private Integer booktour;

    /**
     * cat1은 관광지의 대분류 카테고리를 나타냅니다.
     * @Column: 테이블의 "tour_info_cat1" 열과 매핑.
     */
    @Column(name = "tour_info_cat1")
    private String cat1;

    /**
     * cat2는 관광지의 중분류 카테고리를 나타냅니다.
     * @Column: 테이블의 "tour_info_cat2" 열과 매핑.
     */
    @Column(name = "tour_info_cat2")
    private String cat2;

    /**
     * cat3은 관광지의 소분류 카테고리를 나타냅니다.
     * @Column: 테이블의 "tour_info_cat3" 열과 매핑.
     */
    @Column(name = "tour_info_cat3")
    private String cat3;

    /**
     * contentid는 관광지의 콘텐츠 ID를 나타냅니다.
     * @Column: 테이블의 "tour_info_contentid" 열과 매핑.
     */
    @Column(name = "tour_info_contentid")
    private Integer contentid;

    /**
     * contenttypeid는 관광지의 콘텐츠 타입 ID를 나타냅니다.
     * @Column: 테이블의 "tour_info_contenttypeid" 열과 매핑.
     */
    @Column(name = "tour_info_contenttypeid")
    private Integer contenttypeid;

    /**
     * createdtime은 관광지 정보가 생성된 시간을 나타냅니다.
     * @Column: 테이블의 "tour_info_createdtime" 열과 매핑.
     */
    @Column(name = "tour_info_createdtime")
    private LocalDateTime createdtime;

    /**
     * firstimage는 관광지의 대표 이미지를 나타내는 URL입니다.
     * @Column: 테이블의 "tour_info_firstimage" 열과 매핑.
     */
    @Column(name = "tour_info_firstimage")
    private String firstimage;

    /**
     * firstimage2는 관광지의 추가 이미지를 나타내는 URL입니다.
     * @Column: 테이블의 "tour_info_firstimage2" 열과 매핑.
     */
    @Column(name = "tour_info_firstimage2")
    private String firstimage2;

    /**
     * cpyrhtDivCd는 저작권 구분 코드를 나타냅니다.
     * @Column: 테이블의 "tour_info_cpyrht_div_cd" 열과 매핑.
     */
    @Column(name = "tour_info_cpyrht_div_cd")
    private String cpyrhtDivCd;

    /**
     * mapX는 관광지의 X 좌표(경도)를 나타냅니다.
     * @Column: 테이블의 "tour_info_mapX" 열과 매핑.
     */
    @Column(name = "tour_info_mapX")
    private Double mapX;

    /**
     * mapY는 관광지의 Y 좌표(위도)를 나타냅니다.
     * @Column: 테이블의 "tour_info_mapY" 열과 매핑.
     */
    @Column(name = "tour_info_mapY")
    private Double mapY;

    /**
     * mlevel은 관광지의 지도 레벨을 나타냅니다.
     * @Column: 테이블의 "tour_info_mlevel" 열과 매핑.
     */
    @Column(name = "tour_info_mlevel")
    private Integer mlevel;

    /**
     * modifiedtime은 관광지 정보가 수정된 시간을 나타냅니다.
     * @Column: 테이블의 "tour_info_modifiedtime" 열과 매핑.
     */
    @Column(name = "tour_info_modifiedtime")
    private LocalDateTime modifiedtime;

    /**
     * sigungucode는 관광지의 시군구 코드를 나타냅니다.
     * @Column: 테이블의 "tour_info_sigungucode" 열과 매핑.
     */
    @Column(name = "tour_info_sigungucode")
    private Integer sigungucode;

    /**
     * tel은 관광지의 전화번호를 나타냅니다.
     * @Column: 테이블의 "tour_info_tel" 열과 매핑.
     */
    @Column(name = "tour_info_tel")
    private String tel;

    /**
     * title은 관광지의 이름을 나타냅니다.
     * @Column: 테이블의 "tour_info_title" 열과 매핑.
     */
    @Column(name = "tour_info_title")
    private String title;

    /**
     * zipcode는 관광지의 우편번호를 나타냅니다.
     * @Column: 테이블의 "tour_info_zipcode" 열과 매핑.
     */
    @Column(name = "tour_info_zipcode")
    private String zipcode;
}
