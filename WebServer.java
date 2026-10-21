import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;

public class WebServer {

    private static final int PORT = Integer.parseInt(System.getenv("PORT") != null ? System.getenv("PORT") : "8080");

    // OOP: WebServer uses JobService through composition
    private static final JobService jobService = new JobService();

    public static void main(String[] args) throws Exception {

        System.out.println("DIAGNOSTIC working directory: " + new File(".").getAbsolutePath());
        System.out.println("DIAGNOSTIC index.html exists: " + new File("index.html").isFile());

        ServerSocket server = new ServerSocket(PORT);

        System.out.println("=================================");
        System.out.println(" JobPilot Java Web Server");
        System.out.println(" Server started on port " + PORT);
        System.out.println(" Open: http://localhost:" + PORT);
        System.out.println("=================================");

        while (true) {

            Socket client = server.accept();

            try {
                handleRequest(client);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    client.close();
                } catch (Exception ignored) {
                }
            }
        }
    }

    private static void handleRequest(Socket client) throws Exception {

        OutputStream out = client.getOutputStream();
        HttpRequest request;

        try {
            request = HttpRequest.read(client.getInputStream());
        } catch (IOException e) {
            sendJson(out, 400,
                "{\"error\":\"Invalid HTTP request.\"}");
            return;
        }

        if (request == null) {
            return;
        }

        String method = request.method;
        String path = request.path;

        System.out.println("Requested: " + method + " " + path);

        // =========================
        // MYSQL PROFILE AND SAVED-JOBS API
        // =========================

        if (DatabaseApi.handle(
                method, path, request.headers, request.body, out)) {
            return;
        }

        // =========================
        // EXISTING ADZUNA API
        // =========================

        if (path.startsWith("/api/adzuna")) {
            handleAdzunaRequest(path, out);
            return;
        }

        // =========================
        // EXISTING STATIC FILE SERVER
        // =========================

        if (!"GET".equalsIgnoreCase(method)
                && !"HEAD".equalsIgnoreCase(method)) {
            sendJson(out, 405,
                "{\"error\":\"Method not allowed.\"}");
            return;
        }

        if (path.equals("/")) {
            path = "/index.html";
        }

        int queryIndex = path.indexOf("?");

        if (queryIndex >= 0) {
            path = path.substring(0, queryIndex);
        }

        path = URLDecoder.decode(path, "UTF-8");

        File file = new File("." + path).getCanonicalFile();
        File root = new File(".").getCanonicalFile();

        // Prevent requests from escaping the project directory.
        if (!file.toPath().startsWith(root.toPath())) {
            sendJson(out, 404,
                "{\"error\":\"File not found.\"}");
            return;
        }

        if (file.exists() && file.isFile()) {
            byte[] data = Files.readAllBytes(file.toPath());
            String contentType = getContentType(path);

            String header =
                "HTTP/1.1 200 OK\r\n" +
                "Content-Type: " + contentType + "\r\n" +
                "Content-Length: " + data.length + "\r\n" +
                "Connection: close\r\n\r\n";

            out.write(header.getBytes("UTF-8"));

            if (!"HEAD".equalsIgnoreCase(method)) {
                out.write(data);
            }
        } else {
            String response = "<h1>404 - File Not Found</h1>";
            byte[] data = response.getBytes("UTF-8");

            String header =
                "HTTP/1.1 404 Not Found\r\n" +
                "Content-Type: text/html; charset=UTF-8\r\n" +
                "Content-Length: " + data.length + "\r\n" +
                "Connection: close\r\n\r\n";

            out.write(header.getBytes("UTF-8"));
            out.write(data);
        }

        out.flush();
    }

    // CONTENT TYPE
    // =========================

    private static String getContentType(String path) {

        if (path.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }

        if (path.endsWith(".css")) {
            return "text/css; charset=UTF-8";
        }

        if (path.endsWith(".js")) {
            return "application/javascript; charset=UTF-8";
        }

        if (path.endsWith(".json")) {
            return "application/json; charset=UTF-8";
        }

        if (path.endsWith(".png")) {
            return "image/png";
        }

        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (path.endsWith(".svg")) {
            return "image/svg+xml";
        }

        if (path.endsWith(".ico")) {
            return "image/x-icon";
        }

        return "application/octet-stream";
    }

    // =========================
    // ADZUNA REQUEST
    // =========================

    private static void handleAdzunaRequest(
        String requestPath,
        OutputStream out
    ) throws Exception {

        String queryString = "";

        int questionMark = requestPath.indexOf("?");

        if (questionMark >= 0 &&
            questionMark < requestPath.length() - 1) {

            queryString =
                requestPath.substring(questionMark + 1);
        }

        Map<String, String> params =
            parseQuery(queryString);

        String what = params.get("what");
        String where = params.get("where");
        String page = params.get("page");

        if (what == null || what.trim().isEmpty()) {
            what = "jobs";
        }

        if (where == null) {
            where = "";
        }

        if (page == null || page.trim().isEmpty()) {
            page = "1";
        }

        System.out.println(
            "Sending job search to JobService: " +
            "what=" + what +
            ", where=" + where +
            ", page=" + page
        );

        try {

            // OOP: WebServer delegates business logic
            // to JobService instead of handling the API directly.
            String response =
                jobService.searchJobs(
                    what,
                    where,
                    page
                );

            sendJson(out, 200, response);

        } catch (Exception e) {

            e.printStackTrace();

            sendJson(
                out,
                500,
                "{\"error\":\"Job search service failed.\"}"
            );
        }
    }

    // =========================
    // QUERY STRING PARSER
    // =========================

    private static Map<String, String> parseQuery(
        String query
    ) {

        Map<String, String> params =
            new HashMap<String, String>();

        if (query == null || query.isEmpty()) {
            return params;
        }

        String[] pairs = query.split("&");

        for (String pair : pairs) {

            int equals = pair.indexOf("=");

            if (equals >= 0) {

                String key =
                    pair.substring(0, equals);

                String value =
                    pair.substring(equals + 1);

                try {

                    key = URLDecoder.decode(
                        key,
                        "UTF-8"
                    );

                    value = URLDecoder.decode(
                        value,
                        "UTF-8"
                    );

                } catch (Exception ignored) {
                }

                params.put(key, value);
            }
        }

        return params;
    }

    // =========================
    // JSON RESPONSE
    // =========================

    private static void sendJson(
        OutputStream out,
        int statusCode,
        String json
    ) throws IOException {

        byte[] data =
            json.getBytes("UTF-8");

        String statusText = "OK";

        if (statusCode == 400) {
            statusText = "Bad Request";
        } else if (statusCode == 404) {
            statusText = "Not Found";
        } else if (statusCode == 500) {
            statusText = "Internal Server Error";
        } else if (statusCode >= 400) {
            statusText = "Error";
        }

        String header =
            "HTTP/1.1 " +
            statusCode +
            " " +
            statusText +
            "\r\n" +
            "Content-Type: application/json; charset=UTF-8\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Content-Length: " +
            data.length +
            "\r\n" +
            "Connection: close\r\n\r\n";

        out.write(header.getBytes("UTF-8"));
        out.write(data);
        out.flush();
    }
}
