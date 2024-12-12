package com.tech.seoul.tour.tourCamping;

import javax.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_camping")
@Getter
@Setter
public class TourCamping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_camping_id")
    private Integer tourCampingId;

    @Column(name = "tour_camping_faclt_nm")
    private String facltNm;

    @Column(name = "tour_camping_line_intro")
    private String lineIntro;

    @Column(name = "tour_camping_intro")
    private String intro;

    @Column(name = "tour_camping_allar")
    private String allar;

    @Column(name = "tour_camping_insrnc_at")
    private String insrncAt;

    @Column(name = "tour_camping_trsagnt_no")
    private String trsagntNo;

    @Column(name = "tour_camping_bizrno")
    private String bizrno;

    @Column(name = "tour_camping_faclt_div_nm")
    private String facltDivNm;

    @Column(name = "tour_camping_mange_div_nm")
    private String mangeDivNm;

    @Column(name = "tour_camping_manage_sttus")
    private String manageSttus;

    @Column(name = "tour_camping_hvof_bgnde")
    private String hvofBgnde;

    @Column(name = "tour_camping_hvof_enddle")
    private String hvofEnddle;

    @Column(name = "tour_camping_feature_nm")
    private String featureNm;

    @Column(name = "tour_camping_induty")
    private String induty;

    @Column(name = "tour_camping_lct_cl")
    private String lctCl;

    @Column(name = "tour_camping_do_nm")
    private String doNm;

    @Column(name = "tour_camping_sigungu_nm")
    private String sigunguNm;

    @Column(name = "tour_camping_zipcode")
    private String zipcode;

    @Column(name = "tour_camping_addr1")
    private String addr1;

    @Column(name = "tour_camping_addr2")
    private String addr2;

    @Column(name = "tour_camping_map_x")
    private Double mapX;

    @Column(name = "tour_camping_map_y")
    private Double mapY;

    @Column(name = "tour_camping_direction")
    private String direction;

    @Column(name = "tour_camping_tel")
    private String tel;

    @Column(name = "tour_camping_homepage")
    private String homepage;

    @Column(name = "tour_camping_resve_url")
    private String resveUrl;

    @Column(name = "tour_camping_resve_cl")
    private String resveCl;

    @Column(name = "tour_camping_manage_nmpr")
    private Integer manageNmpr;

    @Column(name = "tour_camping_gnrl_site_co")
    private Integer gnrlSiteCo;

    @Column(name = "tour_camping_auto_site_co")
    private Integer autoSiteCo;

    @Column(name = "tour_camping_glamp_site_co")
    private Integer glampSiteCo;

    @Column(name = "tour_camping_carav_site_co")
    private Integer caravSiteCo;

    @Column(name = "tour_camping_indvdl_carav_site_co")
    private Integer indvdlCaravSiteCo;

    @Column(name = "tour_camping_sited_stnc")
    private String sitedStnc;

    @Column(name = "tour_camping_site_mg1_width")
    private String siteMg1Width;

    @Column(name = "tour_camping_site_mg2_width")
    private String siteMg2Width;

    @Column(name = "tour_camping_site_mg3_width")
    private String siteMg3Width;

    @Column(name = "tour_camping_site_mg1_vrticl")
    private String siteMg1Vrticl;

    @Column(name = "tour_camping_site_mg2_vrticl")
    private String siteMg2Vrticl;

    @Column(name = "tour_camping_site_mg3_vrticl")
    private String siteMg3Vrticl;

    @Column(name = "tour_camping_site_mg1_co")
    private Integer siteMg1Co;

    @Column(name = "tour_camping_site_mg2_co")
    private Integer siteMg2Co;

    @Column(name = "tour_camping_site_mg3_co")
    private Integer siteMg3Co;

    @Column(name = "tour_camping_site_bottom_cl1")
    private String siteBottomCl1;

    @Column(name = "tour_camping_site_bottom_cl2")
    private String siteBottomCl2;

    @Column(name = "tour_camping_site_bottom_cl3")
    private String siteBottomCl3;

    @Column(name = "tour_camping_site_bottom_cl4")
    private String siteBottomCl4;

    @Column(name = "tour_camping_site_bottom_cl5")
    private String siteBottomCl5;

    @Column(name = "tour_camping_tooltip")
    private String tooltip;

    @Column(name = "tour_camping_glamp_inner_fclty")
    private String glampInnerFclty;

    @Column(name = "tour_camping_carav_inner_fclty")
    private String caravInnerFclty;

    @Column(name = "tour_camping_prmisn_de")
    private String prmisnDe;

    @Column(name = "tour_camping_oper_pd_cl")
    private String operPdCl;

    @Column(name = "tour_camping_oper_de_cl")
    private String operDeCl;

    @Column(name = "tour_camping_trler_acmpny_at")
    private String trlerAcmpnyAt;

    @Column(name = "tour_camping_carav_acmpny_at")
    private String caravAcmpnyAt;

    @Column(name = "tour_camping_toilet_co")
    private Integer toiletCo;

    @Column(name = "tour_camping_swrm_co")
    private Integer swrmCo;

    @Column(name = "tour_camping_wtrpl_co")
    private Integer wtrplCo;

    @Column(name = "tour_camping_brazier_cl")
    private String brazierCl;

    @Column(name = "tour_camping_sbrs_cl")
    private String sbrsCl;

    @Column(name = "tour_camping_sbrs_etc")
    private String sbrsEtc;

    @Column(name = "tour_camping_posbl_fclty_cl")
    private String posblFcltyCl;

    @Column(name = "tour_camping_posbl_fclty_etc")
    private String posblFcltyEtc;

    @Column(name = "tour_camping_cltur_event_at")
    private String clturEventAt;

    @Column(name = "tour_camping_cltur_event")
    private String clturEvent;

    @Column(name = "tour_camping_exprn_progrm_at")
    private String exprnProgrmAt;

    @Column(name = "tour_camping_exprn_progrm")
    private String exprnProgrm;

    @Column(name = "tour_camping_extshr_co")
    private Integer extshrCo;

    @Column(name = "tour_camping_frprvt_wrpp_co")
    private Integer frprvtWrppCo;

    @Column(name = "tour_camping_frprvt_sand_co")
    private Integer frprvtSandCo;

    @Column(name = "tour_camping_fire_sensor_co")
    private Integer fireSensorCo;

    @Column(name = "tour_camping_thema_envrn_cl")
    private String themaEnvrnCl;

    @Column(name = "tour_camping_eqpmn_lend_cl")
    private String eqpmnLendCl;

    @Column(name = "tour_camping_animal_cmg_cl")
    private String animalCmgCl;

    @Column(name = "tour_camping_tour_era_cl")
    private String tourEraCl;

    @Column(name = "tour_camping_first_image_url")
    private String firstImageUrl;

    @Column(name = "tour_camping_created_time")
    private LocalDateTime createdTime;

    @Column(name = "tour_camping_modified_time")
    private LocalDateTime modifiedTime;
}
