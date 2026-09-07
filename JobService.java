import java.util.*;

public class JobService {

    private final AdzunaClient adzunaClient;

    public JobService() {
        adzunaClient = new AdzunaClient();
    }

    public String searchJobs(
            String what,
            String where,
            String page) throws Exception {

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
            "JobService: searching for " +
            what + " in " + where
        );

        return adzunaClient.searchJobs(
            what,
            where,
            page
        );
    }
}
