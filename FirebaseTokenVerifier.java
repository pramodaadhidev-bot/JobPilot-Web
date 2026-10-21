import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

public class FirebaseTokenVerifier {

    private static final String PROJECT_ID =
        "jobrecommendationsystem-ca77e";

    private static final String ISSUER =
        "https://securetoken.google.com/" + PROJECT_ID;

    private static final String CERT_URL =
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

    private static Map<String, PublicKey> cachedKeys =
        new HashMap<String, PublicKey>();

    private static long keysExpireAt = 0;

    private static synchronized Map<String, PublicKey> getKeys()
            throws Exception {

        if (!cachedKeys.isEmpty()
                && System.currentTimeMillis() < keysExpireAt) {
            return cachedKeys;
        }

        HttpURLConnection connection =
            (HttpURLConnection) new URL(CERT_URL).openConnection();

        connection.setConnectTimeout(10000);
        connection.setReadTimeout(10000);
        connection.setRequestMethod("GET");

        try {
            int status = connection.getResponseCode();

            if (status != 200) {
                throw new SecurityException(
                    "Unable to retrieve Firebase signing keys");
            }

            StringBuilder body = new StringBuilder();

            try (InputStream input = connection.getInputStream();
                 BufferedReader reader = new BufferedReader(
                     new InputStreamReader(input, StandardCharsets.UTF_8))) {

                String line;
                while ((line = reader.readLine()) != null) {
                    body.append(line);
                }
            }

            JSONObject certificates = new JSONObject(body.toString());
            Map<String, PublicKey> keys =
                new HashMap<String, PublicKey>();

            CertificateFactory factory =
                CertificateFactory.getInstance("X.509");

            for (String kid : certificates.keySet()) {
                byte[] certBytes = certificates.getString(kid)
                    .getBytes(StandardCharsets.US_ASCII);

                X509Certificate certificate =
                    (X509Certificate) factory.generateCertificate(
                        new java.io.ByteArrayInputStream(certBytes));

                keys.put(kid, certificate.getPublicKey());
            }

            if (keys.isEmpty()) {
                throw new SecurityException(
                    "No Firebase signing keys were returned");
            }

            long maxAgeSeconds = 3600;
            String cacheControl =
                connection.getHeaderField("Cache-Control");

            if (cacheControl != null) {
                Matcher matcher = Pattern.compile(
                    "max-age=(\\d+)").matcher(cacheControl);

                if (matcher.find()) {
                    maxAgeSeconds = Long.parseLong(matcher.group(1));
                }
            }

            cachedKeys = keys;
            keysExpireAt = System.currentTimeMillis()
                + Math.max(60, maxAgeSeconds) * 1000L;

            return cachedKeys;
        } finally {
            connection.disconnect();
        }
    }

    public static JSONObject verify(String token) throws Exception {

        if (token == null || token.trim().isEmpty()) {
            throw new SecurityException("Missing Firebase ID token");
        }

        String[] parts = token.split("\\.", -1);

        if (parts.length != 3) {
            throw new SecurityException("Malformed Firebase ID token");
        }

        Base64.Decoder decoder = Base64.getUrlDecoder();

        JSONObject header = new JSONObject(
            new String(decoder.decode(parts[0]),
                StandardCharsets.UTF_8));

        if (!"RS256".equals(header.optString("alg"))) {
            throw new SecurityException("Invalid token algorithm");
        }

        String kid = header.optString("kid");

        if (kid.isEmpty()) {
            throw new SecurityException("Missing signing key ID");
        }

        PublicKey publicKey = getKeys().get(kid);

        if (publicKey == null) {
            synchronized (FirebaseTokenVerifier.class) {
                keysExpireAt = 0;
            }

            publicKey = getKeys().get(kid);
        }

        if (publicKey == null) {
            throw new SecurityException("Unknown Firebase signing key");
        }

        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(
            (parts[0] + "." + parts[1])
                .getBytes(StandardCharsets.US_ASCII));

        if (!signature.verify(decoder.decode(parts[2]))) {
            throw new SecurityException("Invalid token signature");
        }

        JSONObject claims = new JSONObject(
            new String(decoder.decode(parts[1]),
                StandardCharsets.UTF_8));

        long now = System.currentTimeMillis() / 1000L;

        if (!PROJECT_ID.equals(claims.optString("aud"))) {
            throw new SecurityException("Invalid token audience");
        }

        if (!ISSUER.equals(claims.optString("iss"))) {
            throw new SecurityException("Invalid token issuer");
        }

        if (claims.optLong("exp", 0) <= now) {
            throw new SecurityException("Firebase ID token has expired");
        }

        if (claims.optLong("iat", Long.MAX_VALUE) > now) {
            throw new SecurityException("Token issued in the future");
        }

        if (claims.optLong("auth_time", Long.MAX_VALUE) > now) {
            throw new SecurityException("Invalid authentication time");
        }

        String uid = claims.optString("sub");

        if (uid.isEmpty() || uid.length() > 128) {
            throw new SecurityException("Invalid Firebase user ID");
        }

        return claims;
    }
}
