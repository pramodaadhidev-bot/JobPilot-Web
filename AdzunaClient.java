import java.io.*;
import java.net.*;

public class AdzunaClient {

    private final String appId;
    private final String appKey;

    public AdzunaClient() {
        appId = System.getenv("ADZUNA_APP_ID");
        appKey = System.getenv("ADZUNA_APP_KEY");
    }

    public String searchJobs(String what, String where, String page)
            throws Exception {

        if (appId == null || appId.trim().isEmpty()
                || appKey == null || appKey.trim().isEmpty()) {

            throw new IllegalStateException(
                "Adzuna API credentials are not configured."
            );
        }

        String apiUrl =
            "https://api.adzuna.com/v1/api/jobs/in/search/" +
            URLEncoder.encode(page, "UTF-8") +
            "?app_id=" + URLEncoder.encode(appId, "UTF-8") +
            "&app_key=" + URLEncoder.encode(appKey, "UTF-8") +
            "&results_per_page=50" +
            "&what=" + URLEncoder.encode(what, "UTF-8") +
            "&where=" + URLEncoder.encode(where, "UTF-8") +
            "&content-type=application/json";

        HttpURLConnection connection =
            (HttpURLConnection) new URL(apiUrl).openConnection();

        connection.setRequestMethod("GET");
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(15000);
        connection.setRequestProperty(
            "Accept",
            "application/json"
        );

        int status = connection.getResponseCode();

        InputStream stream;

        if (status >= 200 && status < 300) {
            stream = connection.getInputStream();
        } else {
            stream = connection.getErrorStream();

            if (stream == null) {
                stream = new ByteArrayInputStream(
                    "{\"error\":\"Adzuna request failed.\"}"
                        .getBytes("UTF-8")
                );
            }
        }

        String response = readStream(stream);

        connection.disconnect();

        if (status < 200 || status >= 300) {
            throw new IOException(
                "Adzuna returned HTTP " + status + ": " + response
            );
        }

        return response;
    }

    private String readStream(InputStream stream)
            throws IOException {

        BufferedReader reader =
            new BufferedReader(
                new InputStreamReader(stream, "UTF-8")
            );

        StringBuilder result = new StringBuilder();

        String line;

        while ((line = reader.readLine()) != null) {
            result.append(line);
        }

        reader.close();

        return result.toString();
    }
}
