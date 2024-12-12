package com.tech.seoul.tour.tourCamping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourCampingService {

    @Autowired
    private TourCampingRepository tourCampingRepository;

    public List<TourCampingDTO> getNearbyTourCampings(double latitude, double longitude, double radius, String cat1) {
        List<Object[]> results = tourCampingRepository.findByLocationAndCategory(latitude, longitude, radius, cat1);
        List<TourCampingDTO> tourCampings = new ArrayList<>();

        for (Object[] row : results) {
            TourCampingDTO dto = new TourCampingDTO();
            dto.setTourCampingId(((Number) row[0]).intValue());        // Integer
            dto.setFacltNm((String) row[1]);                          // String
            dto.setLineIntro((String) row[2]);                        // String
            dto.setIntro((String) row[3]);                            // String
            dto.setAllar((String) row[4]);                            // String
            dto.setInsrncAt((String) row[5]);                         // String
            dto.setTrsagntNo((String) row[6]);                        // String
            dto.setBizrno((String) row[7]);                           // String
            dto.setFacltDivNm((String) row[8]);                       // String
            dto.setMangeDivNm((String) row[9]);                       // String
            dto.setMgcDiv((String) row[10]);                          // String
            dto.setManageSttus((String) row[11]);                     // String
            dto.setHvofBgnde((String) row[12]);                       // String
            dto.setHvofEnddle((String) row[13]);                      // String
            dto.setFeatureNm((String) row[14]);                       // String
            dto.setInduty((String) row[15]);                          // String
            dto.setLctCl((String) row[16]);                           // String
            dto.setDoNm((String) row[17]);                            // String
            dto.setSigunguNm((String) row[18]);                       // String
            dto.setZipcode((String) row[19]);                         // String
            dto.setAddr1((String) row[20]);                           // String
            dto.setAddr2((String) row[21]);                           // String
            dto.setMapX(((Number) row[22]).doubleValue());            // Double
            dto.setMapY(((Number) row[23]).doubleValue());            // Double
            dto.setDirection((String) row[24]);                       // String
            dto.setTel((String) row[25]);                             // String
            dto.setHomepage((String) row[26]);                        // String
            dto.setResveUrl((String) row[27]);                        // String
            dto.setResveCl((String) row[28]);                         // String
            dto.setManageNmpr(((Number) row[29]).intValue());         // Integer
            dto.setGnrlSiteCo(((Number) row[30]).intValue());         // Integer
            dto.setAutoSiteCo(((Number) row[31]).intValue());         // Integer
            dto.setGlampSiteCo(((Number) row[32]).intValue());        // Integer
            dto.setCaravSiteCo(((Number) row[33]).intValue());        // Integer
            dto.setIndvdlCaravSiteCo(((Number) row[34]).intValue());  // Integer
            dto.setSitedStnc((String) row[35]);                       // String
            dto.setSiteMg1Width((String) row[36]);                    // String
            dto.setSiteMg2Width((String) row[37]);                    // String
            dto.setSiteMg3Width((String) row[38]);                    // String
            dto.setSiteMg1Vrticl((String) row[39]);                   // String
            dto.setSiteMg2Vrticl((String) row[40]);                   // String
            dto.setSiteMg3Vrticl((String) row[41]);                   // String
            dto.setSiteMg1Co(((Number) row[42]).intValue());          // Integer
            dto.setSiteMg2Co(((Number) row[43]).intValue());          // Integer
            dto.setSiteMg3Co(((Number) row[44]).intValue());          // Integer
            dto.setSiteBottomCl1((String) row[45]);                   // String
            dto.setSiteBottomCl2((String) row[46]);                   // String
            dto.setSiteBottomCl3((String) row[47]);                   // String
            dto.setSiteBottomCl4((String) row[48]);                   // String
            dto.setSiteBottomCl5((String) row[49]);                   // String
            dto.setTooltip((String) row[50]);                         // String
            dto.setGlampInnerFclty((String) row[51]);                 // String
            dto.setCaravInnerFclty((String) row[52]);                 // String
            dto.setPrmisnDe((String) row[53]);                        // String
            dto.setOperPdCl((String) row[54]);                        // String
            dto.setOperDeCl((String) row[55]);                        // String
            dto.setTrlerAcmpnyAt((String) row[56]);                   // String
            dto.setCaravAcmpnyAt((String) row[57]);                   // String
            dto.setToiletCo(((Number) row[58]).intValue());           // Integer
            dto.setSwrmCo(((Number) row[59]).intValue());             // Integer
            dto.setWtrplCo(((Number) row[60]).intValue());            // Integer
            dto.setBrazierCl((String) row[61]);                       // String
            dto.setSbrsCl((String) row[62]);                          // String
            dto.setSbrsEtc((String) row[63]);                         // String
            dto.setPosblFcltyCl((String) row[64]);                    // String
            dto.setPosblFcltyEtc((String) row[65]);                   // String
            dto.setClturEventAt((String) row[66]);                    // String
            dto.setClturEvent((String) row[67]);                      // String
            dto.setExprnProgrmAt((String) row[68]);                   // String
            dto.setExprnProgrm((String) row[69]);                     // String
            dto.setExtshrCo(((Number) row[70]).intValue());           // Integer
            dto.setFrprvtWrppCo(((Number) row[71]).intValue());       // Integer
            dto.setFrprvtSandCo(((Number) row[72]).intValue());       // Integer
            dto.setFireSensorCo(((Number) row[73]).intValue());       // Integer
            dto.setThemaEnvrnCl((String) row[74]);                    // String
            dto.setEqpmnLendCl((String) row[75]);                     // String
            dto.setAnimalCmgCl((String) row[76]);                     // String
            dto.setTourEraCl((String) row[77]);                       // String
            dto.setFirstImageUrl((String) row[78]);                   // String
            dto.setCreatedTime((String) row[79]);                     // String
            dto.setModifiedTime((String) row[80]);                    // String

            tourCampings.add(dto);
        }

        return tourCampings;
    }
}
