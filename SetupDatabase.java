import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class SetupDatabase {

    public static void main(String[] args) throws Exception {

        String host = System.getenv("DB_HOST");
        String port = System.getenv("DB_PORT");
        String name = System.getenv("DB_NAME");
        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");

        if (host == null || port == null || name == null ||
            user == null || password == null) {
            throw new IllegalStateException(
                "Database environment variables are missing."
            );
        }

        String url = "jdbc:mysql://" + host + ":" + port + "/" +
            name + "?sslMode=REQUIRED";

        Class.forName("com.mysql.cj.jdbc.Driver");

        try (Connection connection =
                 DriverManager.getConnection(url, user, password);
             Statement statement = connection.createStatement()) {

            statement.executeUpdate(
                "CREATE TABLE IF NOT EXISTS user_profiles (" +
                "firebase_uid VARCHAR(128) NOT NULL PRIMARY KEY," +
                "skills TEXT," +
                "qualification VARCHAR(255)," +
                "experience VARCHAR(100)," +
                "preferred_location VARCHAR(255)," +
                "expected_salary VARCHAR(100)," +
                "job_type VARCHAR(100)," +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP " +
                "ON UPDATE CURRENT_TIMESTAMP" +
                ") ENGINE=InnoDB"
            );

            statement.executeUpdate(
                "CREATE TABLE IF NOT EXISTS saved_jobs (" +
                "id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
                "firebase_uid VARCHAR(128) NOT NULL," +
                "job_save_id VARCHAR(512) NOT NULL," +
                "job_data JSON NOT NULL," +
                "saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "UNIQUE KEY unique_user_job " +
                "(firebase_uid, job_save_id)" +
                ") ENGINE=InnoDB"
            );

            System.out.println("Database setup successful.");
            System.out.println("Created or verified: user_profiles");
            System.out.println("Created or verified: saved_jobs");
        }
    }
}
