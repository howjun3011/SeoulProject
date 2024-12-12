package com.tech.seoul.tour;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import org.json.JSONArray;
import org.json.JSONObject;

public class ApiExplorerTourInfo {
    public static void main(String[] args) {
        Connection con = null; // 데이터베이스 연결 객체 선언
        PreparedStatement pstmt = null; // SQL 문을 실행할 객체 선언
        try {
            // MySQL DB 연결 설정
            String urlDB = "jdbc:mysql://144.24.66.179:5705/goott";
            String user = "green";
            String password = "123456";
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(urlDB, user, password);
            con.setAutoCommit(false);
            System.out.println("MySQL에 연결 성공!");

            String sql = "INSERT INTO tour_info (" +
                    "tour_info_addr1," +
                    "tour_info_addr2," +
                    "tour_info_areacode," +
                    "tour_info_booktour," +
                    "tour_info_cat1," +
                    "tour_info_cat2," +
                    "tour_info_cat3," +
                    "tour_info_contentid," +
                    "tour_info_contenttypeid," +
                    "tour_info_createdtime," +
                    "tour_info_firstimage," +
                    "tour_info_firstimage2," +
                    "tour_info_cpyrhtDivCd," +
                    "tour_info_mapx," +
                    "tour_info_mapy," +
                    "tour_info_mlevel," +
                    "tour_info_modifiedtime," +
                    "tour_info_sigungucode," +
                    "tour_info_tel," +
                    "tour_info_title," +
                    "tour_info_zipcode" +
                    ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            pstmt = con.prepareStatement(sql);

            int batchSize = 1000;
            int count = 0;

            // API 기본 URL 구성
            String API_KEY = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
            StringBuilder baseUrlBuilder = new StringBuilder("https://apis.data.go.kr/B551011/KorService1/areaBasedList1");
            baseUrlBuilder.append("?MobileOS=ETC");
            baseUrlBuilder.append("&MobileApp=AppTest");
            baseUrlBuilder.append("&_type=json");
            baseUrlBuilder.append("&listYN=Y");
            baseUrlBuilder.append("&areaCode=1");
            baseUrlBuilder.append("&serviceKey=" + URLEncoder.encode(API_KEY, "UTF-8"));

            // 첫 번째 요청으로 totalCount 가져오기
            String firstUrl = baseUrlBuilder.toString() + "&numOfRows=1&pageNo=1";
            URL url = new URL(firstUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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

            // JSON 응답에서 totalCount 확인
            JSONObject jsonResponse = new JSONObject(sb.toString());
            JSONObject responseBody = jsonResponse.getJSONObject("response").getJSONObject("body");
            int totalCount = responseBody.getInt("totalCount");
            System.out.println("Total Count: " + totalCount);

            // 필요한 페이지 수 계산
            int numOfRows = 1000;
            int totalPages = (int) Math.ceil((double) totalCount / numOfRows);

            // 페이징 처리
            for (int page = 1; page <= totalPages; page++) {
                String pageUrl = baseUrlBuilder.toString() + "&numOfRows=" + numOfRows + "&pageNo=" + page;
                System.out.println("Fetching Page: " + page);
                url = new URL(pageUrl);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Content-type", "application/json");
                if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                    rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                } else {
                    rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                }
                sb = new StringBuilder();
                while ((line = rd.readLine()) != null) {
                    sb.append(line);
                }
                rd.close();
                conn.disconnect();

                // JSON 데이터 파싱
                jsonResponse = new JSONObject(sb.toString());
                responseBody = jsonResponse.getJSONObject("response").getJSONObject("body");
                JSONArray items = responseBody.getJSONObject("items").getJSONArray("item");

                // 데이터 처리 및 DB 저장
                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);

                    String addr1 = item.optString("addr1", "");
                    String addr2 = item.optString("addr2", "");
                    int areacode = item.optInt("areacode", 0);
                    boolean booktour = "1".equals(item.optString("booktour", "0"));
                    String cat1 = item.optString("cat1", "");
                    String cat2 = item.optString("cat2", "");
                    String cat3 = item.optString("cat3", "");
                    int contentid = item.optInt("contentid", 0);
                    int contenttypeid = item.optInt("contenttypeid", 0);
                    String createdtime = item.optString("createdtime", "");
                    String firstimage = item.optString("firstimage", "");
                    String firstimage2 = item.optString("firstimage2", "");
                    String cpyrhtDivCd = item.optString("cpyrhtDivCd", "");
                    double mapx = item.optDouble("mapx", 0.0);
                    double mapy = item.optDouble("mapy", 0.0);
                    int mlevel = item.optInt("mlevel", 0);
                    String modifiedtime = item.optString("modifiedtime", "");
                    int sigungucode = item.optInt("sigungucode", 0);
                    String tel = item.optString("tel", "");
                    String title = item.optString("title", "");
                    String zipcode = item.optString("zipcode", "");

                    pstmt.setString(1, addr1);
                    pstmt.setString(2, addr2);
                    pstmt.setInt(3, areacode);
                    pstmt.setBoolean(4, booktour);
                    pstmt.setString(5, cat1);
                    pstmt.setString(6, cat2);
                    pstmt.setString(7, cat3);
                    pstmt.setInt(8, contentid);
                    pstmt.setInt(9, contenttypeid);
                    pstmt.setString(10, createdtime);
                    pstmt.setString(11, firstimage);
                    pstmt.setString(12, firstimage2);
                    pstmt.setString(13, cpyrhtDivCd);
                    pstmt.setDouble(14, mapx);
                    pstmt.setDouble(15, mapy);
                    pstmt.setInt(16, mlevel);
                    pstmt.setString(17, modifiedtime);
                    pstmt.setInt(18, sigungucode);
                    pstmt.setString(19, tel);
                    pstmt.setString(20, title);
                    pstmt.setString(21, zipcode);

                    pstmt.addBatch();
                    count++;

                    if (count % batchSize == 0) {
                        pstmt.executeBatch();
                        con.commit();
                        pstmt.clearBatch();
                        System.out.println(count + "개의 레코드가 삽입되었습니다.");
                    }
                }
            }

            // 남은 데이터 저장
            if (count % batchSize != 0) {
                pstmt.executeBatch();
                con.commit();
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
                    con.rollback();
                }
            } catch (Exception rollbackEx) {
                rollbackEx.printStackTrace();
            }
        }
    }
}
