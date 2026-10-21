import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class HttpRequest {

    public final String method;
    public final String path;
    public final Map<String, String> headers;
    public final String body;

    private HttpRequest(
            String method,
            String path,
            Map<String, String> headers,
            String body) {
        this.method = method;
        this.path = path;
        this.headers = headers;
        this.body = body;
    }

    public static HttpRequest read(InputStream input)
            throws IOException {

        int[] headerBytes = {0};

        String requestLine = readLine(input, headerBytes);

        if (requestLine == null || requestLine.isEmpty()) {
            return null;
        }

        String[] parts = requestLine.split(" ", 3);

        if (parts.length != 3
                || !parts[2].startsWith("HTTP/1.")) {
            throw new IOException("Invalid HTTP request line.");
        }

        Map<String, String> headers =
            new LinkedHashMap<String, String>();

        String line;

        while ((line = readLine(input, headerBytes)) != null
                && !line.isEmpty()) {

            int colon = line.indexOf(":");

            if (colon <= 0) {
                throw new IOException("Invalid HTTP header.");
            }

            String name = line.substring(0, colon)
                .trim().toLowerCase(Locale.ROOT);

            String value = line.substring(colon + 1).trim();

            if (headers.containsKey(name)) {
                throw new IOException("Duplicate HTTP header.");
            }

            headers.put(name, value);
        }

        if (line == null) {
            throw new IOException("Incomplete HTTP headers.");
        }

        String lengthText = headers.get("content-length");
        int contentLength = 0;

        if (lengthText != null) {
            try {
                contentLength = Integer.parseInt(lengthText);
            } catch (NumberFormatException e) {
                throw new IOException("Invalid content length.");
            }
        }

        if (contentLength < 0 || contentLength > 1048576) {
            throw new IOException("Request body too large.");
        }

        if (headers.containsKey("transfer-encoding")) {
            throw new IOException("Transfer encoding is unsupported.");
        }

        byte[] bodyBytes = new byte[contentLength];
        int offset = 0;

        while (offset < contentLength) {
            int count = input.read(
                bodyBytes, offset, contentLength - offset);

            if (count < 0) {
                throw new IOException("Incomplete request body.");
            }

            offset += count;
        }

        return new HttpRequest(
            parts[0],
            parts[1],
            headers,
            new String(bodyBytes, StandardCharsets.UTF_8)
        );
    }

    private static String readLine(
            InputStream input, int[] totalBytes)
            throws IOException {

        ByteArrayOutputStream bytes =
            new ByteArrayOutputStream();

        boolean carriageReturn = false;

        while (true) {
            int value = input.read();

            if (value < 0) {
                if (bytes.size() == 0 && !carriageReturn) {
                    return null;
                }
                throw new IOException("Incomplete HTTP line.");
            }

            totalBytes[0]++;

            if (totalBytes[0] > 16384) {
                throw new IOException("HTTP headers too large.");
            }

            if (carriageReturn) {
                if (value == '\n') {
                    return new String(
                        bytes.toByteArray(),
                        StandardCharsets.ISO_8859_1);
                }

                bytes.write('\r');
                carriageReturn = false;
            }

            if (value == '\r') {
                carriageReturn = true;
            } else {
                bytes.write(value);
            }
        }
    }
}
