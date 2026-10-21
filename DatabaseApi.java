import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class DatabaseApi {

    public static boolean handle(
            String method,
            String requestPath,
            Map<String, String> headers,
            String body,
            OutputStream out) throws IOException {

        int question = requestPath.indexOf("?");
        String path = question >= 0
            ? requestPath.substring(0, question)
            : requestPath;

        if (!path.equals("/api/profile")
                && !path.equals("/api/saved-jobs")) {
            return false;
        }

        if ("OPTIONS".equalsIgnoreCase(method)) {
            sendEmpty(out, 204, "No Content");
            return true;
        }

        String token = null;
        String authorization = headers.get("authorization");

        if (authorization != null
                && authorization.startsWith("Bearer ")) {
            token = authorization.substring(7).trim();
        }

        final String uid;

        try {
            JSONObject claims = FirebaseTokenVerifier.verify(token);
            uid = claims.optString("sub", "");

            if (uid.isEmpty() || uid.length() > 128) {
                sendJson(out, 401,
                    "{\"error\":\"Authentication required.\"}");
                return true;
            }
        } catch (SecurityException e) {
            sendJson(out, 401,
                "{\"error\":\"Invalid or expired authentication.\"}");
            return true;
        } catch (Exception e) {
            System.err.println(
                "Firebase token verification unavailable.");
            sendJson(out, 503,
                "{\"error\":\"Authentication service unavailable.\"}");
            return true;
        }

        String requestBody = body == null ? "" : body.trim();

        try {
            if (path.equals("/api/profile")) {
                if ("GET".equalsIgnoreCase(method)) {
                    JSONObject profile = DatabaseService.getProfile(uid);
                    JSONObject response = new JSONObject();
                    response.put("profile",
                        profile == null ? JSONObject.NULL : profile);
                    sendJson(out, 200, response.toString());
                    return true;
                }

                if ("PUT".equalsIgnoreCase(method)) {
                    JSONObject input = parseBody(requestBody);
                    JSONObject profile = input.has("profile")
                        && input.opt("profile") instanceof JSONObject
                        ? input.getJSONObject("profile")
                        : input;

                    DatabaseService.saveProfile(uid, profile);

                    sendJson(out, 200,
                        "{\"success\":true}");
                    return true;
                }

                sendJson(out, 405,
                    "{\"error\":\"Method not allowed.\"}");
                return true;
            }

            if (path.equals("/api/saved-jobs")) {
                if ("GET".equalsIgnoreCase(method)) {
                    JSONArray jobs = DatabaseService.getSavedJobs(uid);
                    sendJson(out, 200, jobs.toString());
                    return true;
                }

                if ("POST".equalsIgnoreCase(method)) {
                    JSONObject job = parseBody(requestBody);

                    String saveId = job.optString("_save_id", "");

                    if (saveId.trim().isEmpty()) {
                        saveId = job.optString("id", "");
                    }
                    if (saveId.trim().isEmpty()) {
                        saveId = job.optString("redirect_url", "");
                    }
                    if (saveId.trim().isEmpty()) {
                        saveId = job.optString("title", "");
                    }

                    if (saveId.trim().isEmpty()
                            || saveId.length() > 512) {
                        sendJson(out, 400,
                            "{\"error\":\"A valid job ID is required.\"}");
                        return true;
                    }

                    job.put("_save_id", saveId);
                    DatabaseService.saveJob(uid, saveId, job);

                    sendJson(out, 200,
                        "{\"success\":true}");
                    return true;
                }

                if ("DELETE".equalsIgnoreCase(method)) {
                    String saveId = getQueryValue(
                        requestPath, "saveId");

                    if (saveId.isEmpty()) {
                        saveId = getQueryValue(requestPath, "id");
                    }

                    if (saveId.isEmpty() && !requestBody.isEmpty()) {
                        JSONObject input = parseBody(requestBody);
                        saveId = input.optString("saveId", "");

                        if (saveId.isEmpty()) {
                            saveId = input.optString("_save_id", "");
                        }
                    }

                    if (saveId.trim().isEmpty()
                            || saveId.length() > 512) {
                        sendJson(out, 400,
                            "{\"error\":\"A valid saved-job ID is required.\"}");
                        return true;
                    }

                    DatabaseService.deleteSavedJob(uid, saveId);
                    sendJson(out, 200,
                        "{\"success\":true}");
                    return true;
                }

                sendJson(out, 405,
                    "{\"error\":\"Method not allowed.\"}");
                return true;
            }

        } catch (IllegalArgumentException e) {
            sendJson(out, 400,
                "{\"error\":\"Invalid request data.\"}");
            return true;
        } catch (Exception e) {
            System.err.println(
                "Database API request failed: " +
                e.getClass().getSimpleName());
            sendJson(out, 500,
                "{\"error\":\"Database request failed.\"}");
            return true;
        }

        return false;
    }

    private static JSONObject parseBody(String body) {
        if (body == null || body.isEmpty()) {
            throw new IllegalArgumentException("Missing JSON body.");
        }

        return new JSONObject(body);
    }

    private static String getQueryValue(
            String requestPath, String wantedKey) {

        int question = requestPath.indexOf("?");

        if (question < 0 || question == requestPath.length() - 1) {
            return "";
        }

        String query = requestPath.substring(question + 1);
        String[] pairs = query.split("&");

        for (String pair : pairs) {
            int equals = pair.indexOf("=");
            String key = equals >= 0
                ? pair.substring(0, equals) : pair;
            String value = equals >= 0
                ? pair.substring(equals + 1) : "";

            try {
                key = URLDecoder.decode(key, "UTF-8");
                value = URLDecoder.decode(value, "UTF-8");
            } catch (Exception ignored) {
                return "";
            }

            if (wantedKey.equals(key)) {
                return value;
            }
        }

        return "";
    }

    private static void sendJson(
            OutputStream out, int status, String json)
            throws IOException {

        byte[] data = json.getBytes("UTF-8");
        String statusText = statusText(status);

        String responseHeaders =
            "HTTP/1.1 " + status + " " + statusText + "\r\n" +
            "Content-Type: application/json; charset=UTF-8\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS\r\n" +
            "Access-Control-Allow-Headers: Authorization, Content-Type\r\n" +
            "Access-Control-Max-Age: 600\r\n" +
            "Vary: Origin\r\n" +
            "Content-Length: " + data.length + "\r\n" +
            "Connection: close\r\n\r\n";

        out.write(responseHeaders.getBytes("UTF-8"));
        out.write(data);
        out.flush();
    }

    private static void sendEmpty(
            OutputStream out, int status, String statusText)
            throws IOException {

        String responseHeaders =
            "HTTP/1.1 " + status + " " + statusText + "\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS\r\n" +
            "Access-Control-Allow-Headers: Authorization, Content-Type\r\n" +
            "Access-Control-Max-Age: 600\r\n" +
            "Content-Length: 0\r\n" +
            "Connection: close\r\n\r\n";

        out.write(responseHeaders.getBytes("UTF-8"));
        out.flush();
    }

    private static String statusText(int status) {
        switch (status) {
            case 200: return "OK";
            case 400: return "Bad Request";
            case 401: return "Unauthorized";
            case 405: return "Method Not Allowed";
            case 500: return "Internal Server Error";
            case 503: return "Service Unavailable";
            default: return "Error";
        }
    }
}
