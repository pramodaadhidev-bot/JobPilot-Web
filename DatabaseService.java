import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONObject;

public class DatabaseService {

    private static Connection getConnection() throws Exception {
        String host = System.getenv("DB_HOST");
        String port = System.getenv("DB_PORT");
        String name = System.getenv("DB_NAME");
        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");

        if (host == null || port == null || name == null
                || user == null || password == null) {
            throw new IllegalStateException(
                "Database environment variables are missing."
            );
        }

        Class.forName("com.mysql.cj.jdbc.Driver");

        String url = "jdbc:mysql://" + host + ":" + port
            + "/" + name + "?sslMode=REQUIRED";

        return DriverManager.getConnection(url, user, password);
    }

    public static void saveProfile(
            String uid, JSONObject profile) throws Exception {

        String sql =
            "INSERT INTO user_profiles " +
            "(firebase_uid, skills, qualification, experience, " +
            "preferred_location, expected_salary, job_type) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE " +
            "skills = VALUES(skills), " +
            "qualification = VALUES(qualification), " +
            "experience = VALUES(experience), " +
            "preferred_location = VALUES(preferred_location), " +
            "expected_salary = VALUES(expected_salary), " +
            "job_type = VALUES(job_type)";

        try (Connection connection = getConnection();
             PreparedStatement statement =
                 connection.prepareStatement(sql)) {

            statement.setString(1, uid);
            statement.setString(2, profile.optString("skills", ""));
            statement.setString(3,
                profile.optString("qualification", ""));
            statement.setString(4,
                profile.optString("experience", ""));
            statement.setString(5,
                profile.optString("preferredLocation", ""));
            statement.setString(6,
                profile.optString("expectedSalary", ""));
            statement.setString(7, profile.optString("jobType", ""));

            statement.executeUpdate();
        }
    }

    public static JSONObject getProfile(String uid) throws Exception {
        String sql =
            "SELECT skills, qualification, experience, " +
            "preferred_location, expected_salary, job_type, updated_at " +
            "FROM user_profiles WHERE firebase_uid = ?";

        try (Connection connection = getConnection();
             PreparedStatement statement =
                 connection.prepareStatement(sql)) {

            statement.setString(1, uid);

            try (ResultSet result = statement.executeQuery()) {
                if (!result.next()) {
                    return null;
                }

                JSONObject profile = new JSONObject();
                profile.put("skills", result.getString("skills"));
                profile.put("qualification",
                    result.getString("qualification"));
                profile.put("experience",
                    result.getString("experience"));
                profile.put("preferredLocation",
                    result.getString("preferred_location"));
                profile.put("expectedSalary",
                    result.getString("expected_salary"));
                profile.put("jobType", result.getString("job_type"));
                profile.put("updatedAt",
                    result.getTimestamp("updated_at").toString());

                return profile;
            }
        }
    }

    public static void saveJob(
            String uid, String saveId, JSONObject job) throws Exception {

        if (saveId == null || saveId.trim().isEmpty()
                || saveId.length() > 512) {
            throw new IllegalArgumentException("Invalid saved-job ID.");
        }

        String sql =
            "INSERT INTO saved_jobs " +
            "(firebase_uid, job_save_id, job_data) VALUES (?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE job_data = VALUES(job_data)";

        try (Connection connection = getConnection();
             PreparedStatement statement =
                 connection.prepareStatement(sql)) {

            statement.setString(1, uid);
            statement.setString(2, saveId);
            statement.setString(3, job.toString());
            statement.executeUpdate();
        }
    }

    public static JSONArray getSavedJobs(String uid) throws Exception {
        String sql =
            "SELECT job_save_id, job_data, saved_at " +
            "FROM saved_jobs WHERE firebase_uid = ? " +
            "ORDER BY saved_at DESC";

        JSONArray jobs = new JSONArray();

        try (Connection connection = getConnection();
             PreparedStatement statement =
                 connection.prepareStatement(sql)) {

            statement.setString(1, uid);

            try (ResultSet result = statement.executeQuery()) {
                while (result.next()) {
                    JSONObject job =
                        new JSONObject(result.getString("job_data"));

                    job.put("_save_id",
                        result.getString("job_save_id"));
                    job.put("_saved_at",
                        result.getTimestamp("saved_at").toString());

                    jobs.put(job);
                }
            }
        }

        return jobs;
    }

    public static void deleteSavedJob(
            String uid, String saveId) throws Exception {

        String sql =
            "DELETE FROM saved_jobs " +
            "WHERE firebase_uid = ? AND job_save_id = ?";

        try (Connection connection = getConnection();
             PreparedStatement statement =
                 connection.prepareStatement(sql)) {

            statement.setString(1, uid);
            statement.setString(2, saveId);
            statement.executeUpdate();
        }
    }
}
