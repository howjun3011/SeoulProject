package com.tech.seoul.tour;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class ApiExplorerTourCamping {
    public static void main(String[] args) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            // MySQL DB 연결 설정
            String urlDB = "jdbc:mysql://144.24.66.179:5705/goott";
            String user = "green";
            String password = "123456";
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(urlDB, user, password);
            con.setAutoCommit(false);
            System.out.println("MySQL에 연결 성공!");

            String sql = "INSERT INTO tour_camping (" +
                    "tour_camping_content_id, tour_camping_faclt_nm, tour_camping_line_intro, tour_camping_intro, " +
                    "tour_camping_allar, tour_camping_insrnc_at, tour_camping_trsagnt_no, tour_camping_bizrno, " +
                    "tour_camping_faclt_div_nm, tour_camping_mange_div_nm, tour_camping_mgc_div, " +
                    "tour_camping_manage_sttus, tour_camping_hvof_bgnde, tour_camping_hvof_enddle, " +
                    "tour_camping_feature_nm, tour_camping_induty, tour_camping_lct_cl, tour_camping_do_nm, " +
                    "tour_camping_sigungu_nm, tour_camping_zipcode, tour_camping_addr1, tour_camping_addr2, " +
                    "tour_camping_map_x, tour_camping_map_y, tour_camping_direction, tour_camping_tel, " +
                    "tour_camping_homepage, tour_camping_resve_url, tour_camping_resve_cl, tour_camping_manage_nmpr, " +
                    "tour_camping_gnrl_site_co, tour_camping_auto_site_co, tour_camping_glamp_site_co, " +
                    "tour_camping_carav_site_co, tour_camping_indvdl_carav_site_co, tour_camping_sited_stnc, " +
                    "tour_camping_site_mg1_width, tour_camping_site_mg2_width, tour_camping_site_mg3_width, " +
                    "tour_camping_site_mg1_vrticl, tour_camping_site_mg2_vrticl, tour_camping_site_mg3_vrticl, " +
                    "tour_camping_site_mg1_co, tour_camping_site_mg2_co, tour_camping_site_mg3_co, " +
                    "tour_camping_site_bottom_cl1, tour_camping_site_bottom_cl2, tour_camping_site_bottom_cl3, " +
                    "tour_camping_site_bottom_cl4, tour_camping_site_bottom_cl5, tour_camping_tooltip, " +
                    "tour_camping_glamp_inner_fclty, tour_camping_carav_inner_fclty, tour_camping_prmisn_de, " +
                    "tour_camping_oper_pd_cl, tour_camping_oper_de_cl, tour_camping_trler_acmpny_at, " +
                    "tour_camping_carav_acmpny_at, tour_camping_toilet_co, tour_camping_swrm_co, " +
                    "tour_camping_wtrpl_co, tour_camping_brazier_cl, tour_camping_sbrs_cl, tour_camping_sbrs_etc, " +
                    "tour_camping_posbl_fclty_cl, tour_camping_posbl_fclty_etc, tour_camping_cltur_event_at, " +
                    "tour_camping_cltur_event, tour_camping_exprn_progrm_at, tour_camping_exprn_progrm, " +
                    "tour_camping_extshr_co, tour_camping_frprvt_wrpp_co, tour_camping_frprvt_sand_co, " +
                    "tour_camping_fire_sensor_co, tour_camping_thema_envrn_cl, tour_camping_eqpmn_lend_cl, " +
                    "tour_camping_animal_cmg_cl, tour_camping_tour_era_cl, tour_camping_first_image_url, " +
                    "tour_camping_created_time, tour_camping_modified_time" +
                    ") VALUES (" + "?, ".repeat(81).substring(0, 3 * 81 - 2) + ")";
            pstmt = con.prepareStatement(sql);

            int batchSize = 1000;
            int count = 0;

            // API 기본 URL 구성
            String API_KEY = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
            StringBuilder baseUrlBuilder = new StringBuilder("https://apis.data.go.kr/B551011/GoCamping/basedList");
            baseUrlBuilder.append("?MobileOS=ETC");
            baseUrlBuilder.append("&MobileApp=AppTest");
            baseUrlBuilder.append("&serviceKey=" + URLEncoder.encode(API_KEY, "UTF-8"));
            baseUrlBuilder.append("&_type=json");

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

                    // 필드 설정
                    pstmt.setString(1, item.optString("contentId", null));
                    pstmt.setString(2, item.optString("facltNm", null));
                    pstmt.setString(3, item.optString("lineIntro", null));
                    pstmt.setString(4, item.optString("intro", null));
                    pstmt.setString(5, item.optString("allar", null));
                    pstmt.setString(6, item.optString("insrncAt", null));
                    pstmt.setString(7, item.optString("trsagntNo", null));
                    pstmt.setString(8, item.optString("bizrno", null));
                    pstmt.setString(9, item.optString("facltDivNm", null));
                    pstmt.setString(10, item.optString("mangeDivNm", null));
                    pstmt.setString(11, item.optString("mgcDiv", null));
                    pstmt.setString(12, item.optString("manageSttus", null));
                    // 수정된 코드
                    pstmt.setString(13, (item.has("hvofBgnde") && !item.isNull("hvofBgnde") && !item.getString("hvofBgnde").trim().isEmpty())
                            ? item.getString("hvofBgnde") : null);
                    pstmt.setString(14, (item.has("hvofEnddle") && !item.isNull("hvofEnddle") && !item.getString("hvofEnddle").trim().isEmpty())
                            ? item.getString("hvofEnddle") : null);
                    pstmt.setString(15, item.optString("featureNm", null));
                    pstmt.setString(16, item.optString("induty", null));
                    pstmt.setString(17, item.optString("lctCl", null));
                    pstmt.setString(18, item.optString("doNm", null));
                    pstmt.setString(19, item.optString("sigunguNm", null));
                    pstmt.setString(20, item.optString("zipcode", null));
                    pstmt.setString(21, item.optString("addr1", null));
                    pstmt.setString(22, item.optString("addr2", null));
                    pstmt.setDouble(23, item.optDouble("mapX", 0.0));
                    pstmt.setDouble(24, item.optDouble("mapY", 0.0));
                    pstmt.setString(25, item.optString("direction", null));
                    pstmt.setString(26, item.optString("tel", null));
                    pstmt.setString(27, item.optString("homepage", null));
                    pstmt.setString(28, item.optString("resveUrl", null));
                    pstmt.setString(29, item.optString("resveCl", null));
                    pstmt.setInt(30, item.optInt("manageNmpr", 0));
                    pstmt.setInt(31, item.optInt("gnrlSiteCo", 0));
                    pstmt.setInt(32, item.optInt("autoSiteCo", 0));
                    pstmt.setInt(33, item.optInt("glampSiteCo", 0));
                    pstmt.setInt(34, item.optInt("caravSiteCo", 0));
                    pstmt.setInt(35, item.optInt("indvdlCaravSiteCo", 0));
                    pstmt.setString(36, item.optString("sitedStnc", null));
                    pstmt.setDouble(37, item.optDouble("siteMg1Width", 0.0));
                    pstmt.setDouble(38, item.optDouble("siteMg2Width", 0.0));
                    pstmt.setDouble(39, item.optDouble("siteMg3Width", 0.0));
                    pstmt.setDouble(40, item.optDouble("siteMg1Vrticl", 0.0));
                    pstmt.setDouble(41, item.optDouble("siteMg2Vrticl", 0.0));
                    pstmt.setDouble(42, item.optDouble("siteMg3Vrticl", 0.0));
                    pstmt.setInt(43, item.optInt("siteMg1Co", 0));
                    pstmt.setInt(44, item.optInt("siteMg2Co", 0));
                    pstmt.setInt(45, item.optInt("siteMg3Co", 0));
                    pstmt.setString(46, item.optString("siteBottomCl1", null));
                    pstmt.setString(47, item.optString("siteBottomCl2", null));
                    pstmt.setString(48, item.optString("siteBottomCl3", null));
                    pstmt.setString(49, item.optString("siteBottomCl4", null));
                    pstmt.setString(50, item.optString("siteBottomCl5", null));
                    pstmt.setString(51, item.optString("tooltip", null));
                    pstmt.setString(52, item.optString("glampInnerFclty", null));
                    pstmt.setString(53, item.optString("caravInnerFclty", null));
                    pstmt.setString(54, (item.has("prmisnDe") && !item.isNull("prmisnDe") && !item.getString("prmisnDe").trim().isEmpty())
                            ? item.getString("prmisnDe") : null);
                    pstmt.setString(55, item.optString("operPdCl", null));
                    pstmt.setString(56, item.optString("operDeCl", null));
                    pstmt.setString(57, item.optString("trlerAcmpnyAt", null));
                    pstmt.setString(58, item.optString("caravAcmpnyAt", null));
                    pstmt.setInt(59, item.optInt("toiletCo", 0));
                    pstmt.setInt(60, item.optInt("swrmCo", 0));
                    pstmt.setInt(61, item.optInt("wtrplCo", 0));
                    pstmt.setString(62, item.optString("brazierCl", null));
                    pstmt.setString(63, item.optString("sbrsCl", null));
                    pstmt.setString(64, item.optString("sbrsEtc", null));
                    pstmt.setString(65, item.optString("posblFcltyCl", null));
                    pstmt.setString(66, item.optString("posblFcltyEtc", null));
                    pstmt.setString(67, item.optString("clturEventAt", null));
                    pstmt.setString(68, item.optString("clturEvent", null));
                    pstmt.setString(69, item.optString("exprnProgrmAt", null));
                    pstmt.setString(70, item.optString("exprnProgrm", null));
                    pstmt.setInt(71, item.optInt("extshrCo", 0));
                    pstmt.setInt(72, item.optInt("frprvtWrppCo", 0));
                    pstmt.setInt(73, item.optInt("frprvtSandCo", 0));
                    pstmt.setInt(74, item.optInt("fireSensorCo", 0));
                    pstmt.setString(75, item.optString("themaEnvrnCl", null));
                    pstmt.setString(76, item.optString("eqpmnLendCl", null));
                    pstmt.setString(77, item.optString("animalCmgCl", null));
                    pstmt.setString(78, item.optString("tourEraCl", null));
                    pstmt.setString(79, item.optString("firstImageUrl", null));
                    pstmt.setString(80, item.optString("created_time", null));
                    pstmt.setString(81, item.optString("modified_time", null));

                    // 디버깅 로그 추가 (선택 사항)
                    /*
                    for (int j = 1; j <= 81; j++) {
                        System.out.println("Parameter " + j + ": " + pstmt.getObject(j));
                    }
                    */

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
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                if (con != null) con.close();
            } catch (Exception closeEx) {
                closeEx.printStackTrace();
            }
        }
    }
}
