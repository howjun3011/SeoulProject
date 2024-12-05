package com.tech.seoul;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ApiExplorerTourInfoDetail {
    public static void main(String[] args) {
        // 데이터베이스 연결 정보 (환경 변수나 설정 파일을 통해 관리하는 것을 권장)
        String urlDB = "jdbc:mysql://144.24.66.179:5705/goott?useSSL=false&serverTimezone=UTC";
        String user = "green";
        String password = "123456";

        // API 설정
        String API_KEY = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
        String baseUrl = "https://apis.data.go.kr/B551011/KorService1/detailCommon1";

        // 날짜 형식 변환을 위한 포맷터 (API에서 제공하는 날짜 형식에 맞게 조정)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss"); // 예시 패턴

        // 배치 처리 설정
        int batchSize = 1000;
        int count = 0;

        // 수정된 INSERT 쿼리: 24개의 파라미터로 수정
        String insertSql = "INSERT INTO tour_info_detail (" +
                "tour_info_detail_contentid, " +          // 1
                "tour_info_detail_contenttypeid, " +      // 2
                "tour_info_detail_title, " +              // 3
                "tour_info_detail_createdtime, " +        // 4
                "tour_info_detail_modifiedtime, " +       // 5
                "tour_info_detail_tel, " +                // 6
                "tour_info_detail_telname, " +            // 7
                "tour_info_detail_homepage, " +           // 8
                "tour_info_detail_booktour, " +           // 9
                "tour_info_detail_firstimage, " +         // 10
                "tour_info_detail_firstimage2, " +        // 11
                "tour_info_detail_cpyrhtDivCd, " +        // 12
                "tour_info_detail_areacode, " +           // 13
                "tour_info_detail_sigungucode, " +        // 14
                "tour_info_detail_cat1, " +               // 15
                "tour_info_detail_cat2, " +               // 16
                "tour_info_detail_cat3, " +               // 17
                "tour_info_detail_addr1, " +              // 18
                "tour_info_detail_addr2, " +              // 19
                "tour_info_detail_zipcode, " +            // 20
                "tour_info_detail_mapx, " +               // 21
                "tour_info_detail_mapy, " +               // 22
                "tour_info_detail_mlevel, " +             // 23
                "tour_info_detail_overview) " +            // 24
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (
                // 데이터베이스 연결
                Connection con = DriverManager.getConnection(urlDB, user, password);
                // `tour_info` 테이블에서 `tour_info_contentid` 조회
                PreparedStatement selectPstmt = con.prepareStatement("SELECT tour_info_contentid FROM tour_info");
                // `tour_info_detail` 테이블에 데이터 삽입
                PreparedStatement insertPstmt = con.prepareStatement(insertSql)
        ) {
            con.setAutoCommit(false);
            System.out.println("MySQL에 연결 성공!");

            // `tour_info` 테이블에서 모든 `tour_info_contentid` 가져오기
            ResultSet rs = selectPstmt.executeQuery();
            List<String> contentIds = new ArrayList<>();
            while (rs.next()) {
                contentIds.add(rs.getString("tour_info_contentid"));
            }
            rs.close();

            System.out.println("총 " + contentIds.size() + "개의 contentId를 가져왔습니다.");

            for (String contentId : contentIds) {
                try {
                    // API 요청 URL 구성
                    StringBuilder urlBuilder = new StringBuilder(baseUrl);
                    urlBuilder.append("?MobileOS=ETC");
                    urlBuilder.append("&MobileApp=AppTest");
                    urlBuilder.append("&_type=json");
                    urlBuilder.append("&contentId=").append(URLEncoder.encode(contentId, "UTF-8"));
                    urlBuilder.append("&defaultYN=Y");
                    urlBuilder.append("&firstImageYN=Y");
                    urlBuilder.append("&areacodeYN=Y");
                    urlBuilder.append("&catcodeYN=Y");
                    urlBuilder.append("&addrinfoYN=Y");
                    urlBuilder.append("&mapinfoYN=Y");
                    urlBuilder.append("&overviewYN=Y");
                    urlBuilder.append("&serviceKey=").append(URLEncoder.encode(API_KEY, "UTF-8"));

                    String requestUrl = urlBuilder.toString();
//                    System.out.println("Fetching contentId: " + contentId);

                    // HTTP GET 요청
                    URL url = new URL(requestUrl);
                    HttpURLConnection connHttp = (HttpURLConnection) url.openConnection();
                    connHttp.setRequestMethod("GET");
                    connHttp.setRequestProperty("Content-type", "application/json");
                    connHttp.setRequestProperty("Accept", "application/json"); // Accept 헤더 추가

                    // HTTP 응답 코드 및 Content-Type 확인
                    int responseCode = connHttp.getResponseCode();
                    String contentType = connHttp.getHeaderField("Content-Type");
//                    System.out.println("Response Code: " + responseCode);
//                    System.out.println("Content-Type: " + contentType);

                    BufferedReader rd;
                    if (responseCode >= 200 && responseCode <= 300) {
                        rd = new BufferedReader(new InputStreamReader(connHttp.getInputStream()));
                    } else {
                        rd = new BufferedReader(new InputStreamReader(connHttp.getErrorStream()));
                    }

                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = rd.readLine()) != null) {
                        sb.append(line);
                    }
                    rd.close();
                    connHttp.disconnect();

                    // 응답 내용 출력
                    String responseStr = sb.toString();
//                    System.out.println("Response for contentId " + contentId + ": " + responseStr);

                    if (!contentType.contains("application/json")) {
//                        System.out.println("Unexpected Content-Type for contentId " + contentId + ": " + contentType);
                        continue;
                    }

                    // JSON 응답 파싱
                    JSONObject jsonResponse;
                    try {
                        jsonResponse = new JSONObject(responseStr);
                    } catch (JSONException e) {
                        System.err.println("JSON 파싱 오류 for contentId " + contentId + ": " + e.getMessage());
                        System.err.println("응답 내용: " + responseStr);
                        continue;
                    }

                    // 응답 상태 확인
                    String resultCode = jsonResponse.getJSONObject("response").getJSONObject("header").getString("resultCode");
                    if (!"0000".equals(resultCode)) {
                        String resultMsg = jsonResponse.getJSONObject("response").getJSONObject("header").getString("resultMsg");
                        System.out.println("API 응답 오류 for contentId " + contentId + ": " + resultMsg);
                        continue;
                    }

                    JSONObject responseBody = jsonResponse.getJSONObject("response").getJSONObject("body");
                    JSONObject itemsObj = responseBody.getJSONObject("items");

                    // 'item'의 타입 확인
                    Object itemObj = itemsObj.opt("item");
                    if (itemObj == null) {
                        System.out.println("No 'item' found for contentId " + contentId);
                        continue;
                    }

                    if (itemObj instanceof JSONObject) {
                        // 'item'이 JSONObject인 경우
                        JSONObject item = (JSONObject) itemObj;
                        processItem(item, insertPstmt, formatter);
                        count++;
                    } else if (itemObj instanceof JSONArray) {
                        // 'item'이 JSONArray인 경우 (예상치 않지만 처리)
                        JSONArray itemsArray = (JSONArray) itemObj;
                        for (int j = 0; j < itemsArray.length(); j++) {
                            JSONObject item = itemsArray.getJSONObject(j);
                            processItem(item, insertPstmt, formatter);
                            count++;
                        }
                    } else {
                        // 'item'이 JSONObject도 JSONArray도 아닌 경우
                        System.out.println("'item' is neither JSONObject nor JSONArray for contentId " + contentId);
                        // 전체 응답을 로그로 남겨 문제를 진단
                        System.out.println("Full response for contentId " + contentId + ": " + jsonResponse.toString());
                        continue;
                    }

                    // 배치 사이즈에 도달하면 실행
                    if (count % batchSize == 0) {
                        insertPstmt.executeBatch();
                        con.commit();
                        insertPstmt.clearBatch();
                        System.out.println(count + "개의 레코드가 삽입되었습니다.");
                    }

                    // 잠시 대기 (API 호출 제한을 피하기 위해 필요에 따라 조정)
                    Thread.sleep(100); // 100ms 대기

                } catch (Exception e) {
                    System.err.println("Error processing contentId " + contentId + ": " + e.getMessage());
                    e.printStackTrace();
                    // 필요에 따라 개별 실패 시 롤백 또는 계속 진행할지 결정
                }
            }

            // 남은 데이터 저장
            if (count % batchSize != 0) {
                insertPstmt.executeBatch();
                con.commit();
                insertPstmt.clearBatch();
                System.out.println("나머지 " + (count % batchSize) + "개의 레코드가 삽입되었습니다.");
            }

            System.out.println("총 " + count + "개의 데이터가 성공적으로 저장되었습니다!");

        } catch (Exception e) {
            e.printStackTrace();
            // 전체 트랜잭션 롤백
            // `try-with-resources`를 사용했기 때문에 자동으로 리소스가 닫힙니다.
        }
    }

    /**
     * 'item' JSONObject를 처리하여 PreparedStatement에 매핑하는 메서드
     *
     * @param item        JSON 객체
     * @param insertPstmt PreparedStatement
     * @param formatter   날짜 형식 포맷터
     * @throws SQLException 예외 발생 시
     */
    private static void processItem(JSONObject item, PreparedStatement insertPstmt, DateTimeFormatter formatter) throws SQLException {
        // 데이터 추출
        String fetchedContentId = item.optString("contentid", "");
        String fetchedContentTypeId = item.optString("contenttypeid", "");
        String title = item.optString("title", "");
        String addr1 = item.optString("addr1", "");
        String addr2 = item.optString("addr2", "");
        String tel = item.optString("tel", "");
        String zipcode = item.optString("zipcode", "");
        String cat1 = item.optString("cat1", "");
        String cat2 = item.optString("cat2", "");
        String cat3 = item.optString("cat3", "");
        String firstimage = item.optString("firstimage", "");
        String firstimage2 = item.optString("firstimage2", "");
        String overview = item.optString("overview", "");
        String createdtimeStr = item.optString("createdtime", "");
        String modifiedtimeStr = item.optString("modifiedtime", "");
        String homepage = item.optString("homepage", "");
        String telname = item.optString("telname", "");
        String booktour = item.optString("booktour", "");
        String cpyrhtDivCd = item.optString("cpyrhtDivCd", "");
        String areacode = item.optString("areacode", "");
        String sigungucode = item.optString("sigungucode", "");

        double mapx = item.optDouble("mapx", 0.0);
        double mapy = item.optDouble("mapy", 0.0);
        int mlevel = item.optInt("mlevel", 0);

        // createdtime과 modifiedtime을 LocalDateTime으로 변환 (필요 시 포맷 조정)
        LocalDateTime createdtime = createdtimeStr.isEmpty() ? null : LocalDateTime.parse(createdtimeStr, formatter);
        LocalDateTime modifiedtime = modifiedtimeStr.isEmpty() ? null : LocalDateTime.parse(modifiedtimeStr, formatter);

        // PreparedStatement에 값 설정
        insertPstmt.setString(1, fetchedContentId);
        insertPstmt.setString(2, fetchedContentTypeId);
        insertPstmt.setString(3, title);
        if (createdtime != null) {
            insertPstmt.setObject(4, createdtime);
        } else {
            insertPstmt.setNull(4, Types.TIMESTAMP);
        }
        if (modifiedtime != null) {
            insertPstmt.setObject(5, modifiedtime);
        } else {
            insertPstmt.setNull(5, Types.TIMESTAMP);
        }
        insertPstmt.setString(6, tel);
        insertPstmt.setString(7, telname);
        insertPstmt.setString(8, homepage);
        insertPstmt.setString(9, booktour);
        insertPstmt.setString(10, firstimage);
        insertPstmt.setString(11, firstimage2);
        insertPstmt.setString(12, cpyrhtDivCd);
        insertPstmt.setString(13, areacode);
        insertPstmt.setString(14, sigungucode);
        insertPstmt.setString(15, cat1);
        insertPstmt.setString(16, cat2);
        insertPstmt.setString(17, cat3);
        insertPstmt.setString(18, addr1);
        insertPstmt.setString(19, addr2);
        insertPstmt.setString(20, zipcode);
        if (mapx != 0.0) {
            insertPstmt.setDouble(21, mapx);
        } else {
            insertPstmt.setNull(21, Types.DOUBLE);
        }
        if (mapy != 0.0) {
            insertPstmt.setDouble(22, mapy);
        } else {
            insertPstmt.setNull(22, Types.DOUBLE);
        }
        if (mlevel != 0) {
            insertPstmt.setInt(23, mlevel);
        } else {
            insertPstmt.setNull(23, Types.INTEGER);
        }
        insertPstmt.setString(24, overview);
    }
}
