package com.tech.seoul;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class ApiExplorerHealthPharmacy {
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

            String sql = "INSERT INTO pharm_info (pharm_id, pharm_name, pharm_address, pharm_pnumber, pharm_post, pharm_lat, pharm_lon, pharm_mon_oc, pharm_tue_oc, pharm_wed_oc, pharm_thu_oc, pharm_fri_oc, pharm_sat_oc, pharm_sun_oc, pharm_hol_oc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            pstmt = con.prepareStatement(sql);

            // Batch insert를 위한 변수 초기화
            int batchSize = 1000;
            int count = 0;

            // 2. API 호출 (약국 목록정보 조회)
            StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire");
            urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=yS7P3EDpV941DaSS0Kr%2B9FWPTS03AjXqaKoV89OHZjKVuRgXnQwngjiestfD%2BtV8YWmVMqK2DSwkQlxUZK0jJw%3D%3D");
            urlBuilder.append("&" + URLEncoder.encode("Q0", "UTF-8") + "=" + URLEncoder.encode("서울특별시", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode("1", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode("6000", "UTF-8"));

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

                String pharmId = getTagValue("hpid", item); // 아이디
                String pharmName = getTagValue("dutyName", item); // 이름
                String pharmAddress = getTagValue("dutyAddr", item); // 주소
                String pharmPnumber = getTagValue("dutyTel1", item); // 전화번호
                String pharmPost1 = getTagValue("postCdn1", item); // 우편번호1
                String pharmPost2 = getTagValue("postCdn2", item); // 우편번호2
                String pharmPost = pharmPost1 + pharmPost2; // 우편번호
                String pharmLat = getTagValue("wgs84Lat", item); // 위도
                String pharmLon = getTagValue("wgs84Lon", item); // 경도

                // 요일별 open/close 데이터 가공
                String [] daysOpenClose = new String[8];
                for(int day = 1; day <= 8; day++) {
                    String openTag = "dutyTime" + day + "s";
                    String closeTag = "dutyTime" + day + "c";
                    String openTime = formatTime(getTagValue(openTag, item));
                    String closeTime = formatTime(getTagValue(closeTag, item));
                    daysOpenClose[day - 1] = openTime + "-" + closeTime;
                }

                // 데이터베이스에 저장 - Batch 처리
                pstmt.setString(1, pharmId);
                pstmt.setString(2, pharmName);
                pstmt.setString(3, pharmAddress);
                pstmt.setString(4, pharmPnumber);
                pstmt.setString(5, pharmPost);
                pstmt.setString(6, pharmLat);
                pstmt.setString(7, pharmLon);
                pstmt.setString(8, daysOpenClose[0]); // 월요일 open/close
                pstmt.setString(9, daysOpenClose[1]); // 화요일 open/close
                pstmt.setString(10, daysOpenClose[2]); // 수요일 open/close
                pstmt.setString(11, daysOpenClose[3]); // 목요일 open/close
                pstmt.setString(12, daysOpenClose[4]); // 금요일 open/close
                pstmt.setString(13, daysOpenClose[5]); // 토요일 open/close
                pstmt.setString(14, daysOpenClose[6]); // 일요일 open/close
                pstmt.setString(15, daysOpenClose[7]); // 공휴일 open/close

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
