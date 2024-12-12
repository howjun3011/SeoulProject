package com.tech.seoul;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class ApiExplorerHealthHospitalInfo {
    public static void main(String[] args) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            // 1. MySQL DB 연결 설정
            String urlDB = "jdbc:mysql://144.24.66.179:5705/goott";
            String user = "green"; // MySQL 사용자명
            String password = "123456"; // MySQL 비밀번호
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(urlDB, user, password);
            con.setAutoCommit(false); // 자동 커밋 끄기
            System.out.println("MySQL에 연결 성공!");

            String sql = "INSERT INTO hosp_info (hosp_id, hosp_name, hosp_address, hosp_type_eng, hosp_type, hosp_pnumber, hosp_lunchTime, hosp_location, hosp_post, hosp_lat, hosp_lon, hosp_sbj, hosp_mon_oc, hosp_tue_oc, hosp_wed_oc, hosp_thu_oc, hosp_fri_oc, hosp_sat_oc, hosp_sun_oc, hosp_hol_oc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            pstmt = con.prepareStatement(sql);

            // Batch insert를 위한 변수 초기화
            int batchSize = 1000;
            int count = 0;

            // 2. 첫 번째 API 호출 (병원 목록 조회)
            StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire");
            urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=yS7P3EDpV941DaSS0Kr%2B9FWPTS03AjXqaKoV89OHZjKVuRgXnQwngjiestfD%2BtV8YWmVMqK2DSwkQlxUZK0jJw%3D%3D");
            urlBuilder.append("&" + URLEncoder.encode("Q0", "UTF-8") + "=" + URLEncoder.encode("서울특별시", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("QZ", "UTF-8") + "=" + URLEncoder.encode("", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("20000", "UTF-8"));

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            BufferedReader rd;
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                sb.append(line);
            }
            rd.close();
            conn.disconnect();

            // 3. XML 데이터 파싱
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputStream is = new ByteArrayInputStream(sb.toString().getBytes());
            Document doc = builder.parse(is);

            NodeList itemList = doc.getElementsByTagName("item");

            // 4. 각 병원 정보 처리
            for (int i = 0; i < itemList.getLength(); i++) {
                Element item = (Element) itemList.item(i);

                String hospId = getTagValue("hpid", item); // 아이디
                String hospName = getTagValue("dutyName", item); // 이름
                String hospAddress = getTagValue("dutyAddr", item); // 주소
                String hospTypeEng = getTagValue("dutyDiv", item); // 기관구분(Eng)
                String hospType = getTagValue("dutyDivNam", item); // 기관구분
                String hospPnumber = getTagValue("dutyTel1", item); // 전화번호
                String hospLunchTime = getTagValue("dutyEtc", item); // 점심시간
                String hospLocation = getTagValue("dutyMapimg", item); // 위치
                String hospPost1 = getTagValue("postCdn1", item); // 우편번호1
                String hospPost2 = getTagValue("postCdn2", item); // 우편번호2
                String hospPost = hospPost1 + hospPost2; // 우편번호
                String hospLat = getTagValue("wgs84Lat", item); // 위도
                String hospLon = getTagValue("wgs84Lon", item); // 경도
                String hospSuj = ""; // 진료과목 (두 번째 API에서 가져올 예정)

                // 요일별 open/close 데이터 가공
                String [] daysOpenClose = new String[8];
                for(int day = 1; day <= 8; day++) {
                    String openTag = "dutyTime" + day + "s";
                    String closeTag = "dutyTime" + day + "c";
                    String openTime = formatTime(getTagValue(openTag, item));
                    String closeTime = formatTime(getTagValue(closeTag, item));
                    daysOpenClose[day - 1] = openTime + "-" + closeTime;
                }

                // 5. 두 번째 API 호출하여 추가 정보 가져오기
                StringBuilder urlBuilder2 = new StringBuilder("http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlBassInfoInqire");
                urlBuilder2.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=yS7P3EDpV941DaSS0Kr%2B9FWPTS03AjXqaKoV89OHZjKVuRgXnQwngjiestfD%2BtV8YWmVMqK2DSwkQlxUZK0jJw%3D%3D");
                urlBuilder2.append("&" + URLEncoder.encode("HPID", "UTF-8") + "=" + URLEncoder.encode(hospId, "UTF-8"));
                urlBuilder2.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8"));
                urlBuilder2.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8"));

                URL url2 = new URL(urlBuilder2.toString());
                HttpURLConnection conn2 = (HttpURLConnection) url2.openConnection();
                conn2.setRequestMethod("GET");
                conn2.setRequestProperty("Content-type", "application/json");

                BufferedReader rd2;
                if(conn2.getResponseCode() >= 200 && conn2.getResponseCode() <= 300) {
                    rd2 = new BufferedReader(new InputStreamReader(conn2.getInputStream()));
                } else {
                    rd2 = new BufferedReader(new InputStreamReader(conn2.getErrorStream()));
                }
                StringBuilder sb2 = new StringBuilder();
                String line2;
                while ((line2 = rd2.readLine()) != null) {
                    sb2.append(line2);
                }
                rd2.close();
                conn2.disconnect();

                // 두 번째 API 응답 파싱
                DocumentBuilderFactory factory2 = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder2 = factory2.newDocumentBuilder();
                InputStream is2 = new ByteArrayInputStream(sb2.toString().getBytes());
                Document doc2 = builder2.parse(is2);

                NodeList itemList2 = doc2.getElementsByTagName("item");
                if (itemList2.getLength() > 0) {
                    Element item2 = (Element) itemList2.item(0);

                    // 진료과목 가져오기
                    hospSuj = getTagValue("dgidIdName", item2);
                } else {
                    hospSuj = "정보없음";
                }

                // 데이터베이스에 저장 - Batch 처리
                pstmt.setString(1, hospId);
                pstmt.setString(2, hospName);
                pstmt.setString(3, hospAddress);
                pstmt.setString(4, hospTypeEng);
                pstmt.setString(5, hospType);
                pstmt.setString(6, hospPnumber);
                pstmt.setString(7, hospLunchTime);
                pstmt.setString(8, hospLocation);
                pstmt.setString(9, hospPost);
                pstmt.setString(10, hospLat);
                pstmt.setString(11, hospLon);
                pstmt.setString(12, hospSuj);
                pstmt.setString(13, daysOpenClose[0]); // 월요일 open/close
                pstmt.setString(14, daysOpenClose[1]); // 화요일 open/close
                pstmt.setString(15, daysOpenClose[2]); // 수요일 open/close
                pstmt.setString(16, daysOpenClose[3]); // 목요일 open/close
                pstmt.setString(17, daysOpenClose[4]); // 금요일 open/close
                pstmt.setString(18, daysOpenClose[5]); // 토요일 open/close
                pstmt.setString(19, daysOpenClose[6]); // 일요일 open/close
                pstmt.setString(20, daysOpenClose[7]); // 공휴일 open/close

                pstmt.addBatch();
                count++;

                if(count % batchSize == 0) {
                    pstmt.executeBatch();
                    con.commit(); // 커밋
                    pstmt.clearBatch();
                    System.out.println(count + "개의 레코드가 삽입되었습니다.");
                }
            }

            // 남은 레코드 삽입 및 커밋
            if(count % batchSize != 0) {
                pstmt.executeBatch();
                con.commit(); // 커밋
                pstmt.clearBatch();
                System.out.println("나머지 " + (count % batchSize) + "개의 레코드가 삽입되었습니다.");
            }

            pstmt.close();
            con.close();
            System.out.println("총 " + count + "개의 데이터가 성공적으로 저장되었습니다!");

        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (con != null && !con.isClosed()) {
                    con.rollback(); // 롤백
                }
            } catch (Exception rollbackEx) {
                rollbackEx.printStackTrace();
            }
        }
    }

    // XML 태그 값 가져오기
    private static String getTagValue(String tag, Element element) {
        NodeList nlList = element.getElementsByTagName(tag);
        if(nlList.getLength() > 0 && nlList.item(0).getFirstChild() != null) {
            return nlList.item(0).getFirstChild().getNodeValue();
        }
        return ""; // 값이 없으면 빈 문자열 반환
    }

    // 시간 형식 변환("HHMM" --> "HH:MM")
    private static String formatTime(String time) {
        if(time != null && time.length() == 4) {
            return time.substring(0, 2) + ":" + time.substring(2);
        }
        return "00:00";
    }
}
