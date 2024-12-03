package com.tech.seoul.health.service;

import com.tech.seoul.health.models.HealthDao;
import com.tech.seoul.health.models.HospitalDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
public class HealthService {
    @Autowired
    private HealthDao healthDao;

    public List<HospitalDto> searchHospitalsByLocationAndKeyword(double lat, double lon, double radius, String keyword) {
        List<HospitalDto> hospitals = healthDao.findHospitalWithRadius(lat, lon, radius, keyword);
        processSubjects(hospitals); // 진료과목 리스트 반환
        processSimpleAddress(hospitals); // 간단 주소 생성

        return hospitals;
    }

    public List<HospitalDto> searchHospitalsByKeyword(String keyword) {
        List<HospitalDto> hospitals = healthDao.findByKeyword(keyword);
        processSubjects(hospitals); // 진료과목 리스트 반환
        processSimpleAddress(hospitals); // 간단 주소 생성

        return hospitals;
    }

    // hosp_sbj 필드를 hosp_sbj_list로 변환하는 메서드
    // 콤마로 구분
    private void processSubjects(List<HospitalDto> hospitals) {
        for (HospitalDto hospital : hospitals) {
            if (hospital.getHosp_sbj() != null) {
                // hosp_sbj를 콤마로 분리해서 리스트로 변환
                List<String> subjectList = Arrays.asList(hospital.getHosp_sbj().split("\\s*,\\s*"));
                hospital.setHosp_sbj_list(subjectList); // 리스트를 새로운 필드에 추가
            }
        }
    }

    // 간단 주소 추출
    private void processSimpleAddress(List<HospitalDto> hospitals) {
        for (HospitalDto hospital : hospitals) {
            if (hospital.getHosp_address() != null) {
                String fullAddress = hospital.getHosp_address();
                String simpleAddress = extractSimpleAddress(fullAddress);
                hospital.setHosp_simple_address(simpleAddress);
            }
        }
    }

    // 간단 주소 추출 함순
    private String extractSimpleAddress(String address) {
        if (address == null) {
            return "";
        }

        // 첫 번째 "구"의 위치 찾기
        int guIndex = address.indexOf("구");

        // "구"가 없다면 전체 주소 반환
        if (guIndex == -1) {
            return address.trim();
        }

        // "구"까지 포함하여 endIndex 설정
        int endIndex = guIndex + 1; // "구"는 한 글자이므로 +1

        // "구" 뒤에 공백이 있으면 "구"까지 잘라내기
        if (endIndex < address.length() && address.charAt(endIndex) == ' ') {
            return address.substring(0, endIndex).trim();
        }

        // 공백이 없으면, 다음 공백이나 문자열의 끝까지 잘라내기
        int spaceIndex = address.indexOf(' ', endIndex);
        if (spaceIndex > -1) {
            return address.substring(0, spaceIndex).trim();
        }

        // 공백이 없으면 "구"까지 반환
        return address.substring(0, endIndex).trim();
    }
}
