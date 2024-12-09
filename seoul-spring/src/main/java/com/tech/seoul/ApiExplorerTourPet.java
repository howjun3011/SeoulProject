package com.tech.seoul;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import org.json.JSONArray;
import org.json.JSONObject;

public class ApiExplorerTourPet {
    public static void main(String[] args) {
        // 데이터베이스 연결 정보 (환경 변수나 설정 파일을 통해 관리)
        String urlDB = "jdbc:mysql://144.24.66.179:5705/goott?useSSL=false&serverTimezone=UTC";
        String user = "green";
        String password = "123456";

        // API 설정
        String API_KEY = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
        String baseUrl = "https://apis.data.go.kr/B551011/KorPetTourService/areaBasedList";

        // 배치 처리 설정
        int batchSize = 1000;
        int count = 0;

        // SQL INSERT 쿼리
        String insertSql = "INSERT INTO tour_pet (" +
                "tour_pet_addr1, " +
                "tour_pet_addr2, " +
                "tour_pet_areacode, " +
                "tour_pet_cat1, " +
                "tour_pet_cat2, " +
                "tour_pet_cat3, " +
                "tour_pet_contentid, " +
                "tour_pet_contenttypeid, " +
                "tour_pet_createdtime, " +
                "tour_pet_firstimage, " +
                "tour_pet_firstimage2, " +
                "tour_pet_cpyrhtDivCd, " +
                "tour_pet_mapx, " +
                "tour_pet_mapy, " +
                "tour_pet_mlevel, " +
                "tour_pet_modifiedtime, " +
                "tour_pet_sigungucode, " +
                "tour_pet_tel, " +
                "tour_pet_title, " +
                "tour_pet_zipcode) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (
                // 데이터베이스 연결
                Connection con = DriverManager.getConnection(urlDB, user, password);
                PreparedStatement insertPstmt = con.prepareStatement(insertSql)
        ) {
            con.setAutoCommit(false);
            System.out.println("MySQL에 연결 성공!");

            // API 첫 번째 호출: totalCount 가져오기
            String firstUrl = baseUrl + "?serviceKey=" + URLEncoder.encode(API_KEY, "UTF-8") +
                    "&MobileOS=ETC&MobileApp=AppTest&listYN=Y&areaCode=1&_type=json&numOfRows=1&pageNo=1";
            int totalCount = getTotalCount(firstUrl);
            System.out.println("총 데이터 수: " + totalCount);

            // 필요한 페이지 수 계산
            int numOfRows = 1000;
            int totalPages = (int) Math.ceil((double) totalCount / numOfRows);

            // 데이터 삽입 처리
            for (int page = 1; page <= totalPages; page++) {
                String pageUrl = baseUrl + "?serviceKey=" + URLEncoder.encode(API_KEY, "UTF-8") +
                        "&MobileOS=ETC&MobileApp=AppTest&listYN=Y&areaCode=1&_type=json" +
                        "&numOfRows=" + numOfRows + "&pageNo=" + page;
                System.out.println("Fetching Page: " + page);

                JSONArray items = getItemsFromApi(pageUrl);

                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.getJSONObject(i);

                    String addr1 = item.optString("addr1", "");
                    String addr2 = item.optString("addr2", "");
                    String areacode = item.optString("areacode", "");
                    String cat1 = item.optString("cat1", "");
                    String cat2 = item.optString("cat2", "");
                    String cat3 = item.optString("cat3", "");
                    String contentid = item.optString("contentid", "");
                    String contenttypeid = item.optString("contenttypeid", "");
                    String createdtime = item.optString("createdtime", "");
                    String firstimage = item.optString("firstimage", "");
                    String firstimage2 = item.optString("firstimage2", "");
                    String cpyrhtDivCd = item.optString("cpyrhtDivCd", "");
                    double mapx = item.optDouble("mapx", 0.0);
                    double mapy = item.optDouble("mapy", 0.0);
                    String mlevel = item.optString("mlevel", "");
                    String modifiedtime = item.optString("modifiedtime", "");
                    String sigungucode = item.optString("sigungucode", "");
                    String tel = item.optString("tel", "");
                    String title = item.optString("title", "");
                    String zipcode = item.optString("zipcode", "");

                    insertPstmt.setString(1, addr1);
                    insertPstmt.setString(2, addr2);
                    insertPstmt.setString(3, areacode);
                    insertPstmt.setString(4, cat1);
                    insertPstmt.setString(5, cat2);
                    insertPstmt.setString(6, cat3);
                    insertPstmt.setString(7, contentid);
                    insertPstmt.setString(8, contenttypeid);
                    insertPstmt.setString(9, createdtime);
                    insertPstmt.setString(10, firstimage);
                    insertPstmt.setString(11, firstimage2);
                    insertPstmt.setString(12, cpyrhtDivCd);
                    insertPstmt.setDouble(13, mapx);
                    insertPstmt.setDouble(14, mapy);
                    insertPstmt.setString(15, mlevel);
                    insertPstmt.setString(16, modifiedtime);
                    insertPstmt.setString(17, sigungucode);
                    insertPstmt.setString(18, tel);
                    insertPstmt.setString(19, title);
                    insertPstmt.setString(20, zipcode);

                    insertPstmt.addBatch();
                    count++;

                    if (count % batchSize == 0) {
                        insertPstmt.executeBatch();
                        con.commit();
                        System.out.println(count + "개의 레코드가 삽입되었습니다.");
                    }
                }
            }

            // 남은 데이터 저장
            if (count % batchSize != 0) {
                insertPstmt.executeBatch();
                con.commit();
                System.out.println("나머지 " + (count % batchSize) + "개의 레코드가 삽입되었습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static int getTotalCount(String url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        JSONObject responseBody = new JSONObject(sb.toString())
                .getJSONObject("response")
                .getJSONObject("body");
        return responseBody.getInt("totalCount");
    }

    private static JSONArray getItemsFromApi(String url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        return new JSONObject(sb.toString())
                .getJSONObject("response")
                .getJSONObject("body")
                .getJSONObject("items")
                .getJSONArray("item");
    }
}
