(function () {
    "use strict";

    function getUser() {
        return window.JobPilotAuth &&
            window.JobPilotAuth.auth &&
            window.JobPilotAuth.auth.currentUser;
    }

    function getApplications(uid) {
        try {
            var data = JSON.parse(
                localStorage.getItem("jobpilot_applications_" + uid) || "[]"
            );
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function updateCount(uid, applications) {
        localStorage.setItem(
            "jobpilot_application_count_" + uid,
            String(applications.length)
        );
    }

    function addButtons() {
        document.querySelectorAll(".jobs-pinterest-card").forEach(function (card) {
            var area = card.querySelector(".job-card-bottom");
            if (!area || area.querySelector(".jobpilot-applied-button")) return;

            var button = document.createElement("button");
            button.type = "button";
            button.className = "jobpilot-applied-button";
            button.textContent = "✓ Mark as Applied";
            button.style.cssText =
                "border:1px solid #198754;border-radius:8px;padding:9px 12px;" +
                "background:#fff;color:#198754;font-weight:600;cursor:pointer;";
            area.appendChild(button);
        });
    }

    document.addEventListener("click", function (event) {
        var button = event.target.closest(".jobpilot-applied-button");
        if (!button) return;

        var user = getUser();
        if (!user) {
            alert("Please sign in to track your applications.");
            return;
        }

        var card = button.closest(".jobs-pinterest-card");
        if (!card) return;

        var title = card.querySelector(".job-card-title");
        var company = card.querySelector(".job-card-company");
        var link = card.querySelector(".job-view-button");

        var jobTitle = title ? title.textContent.trim() : "Unknown job";
        var jobCompany = company ? company.textContent.trim() : "Unknown company";
        var jobUrl = link ? link.href : "";

        var applications = getApplications(user.uid);
        var jobId = jobUrl + "|" + jobTitle + "|" + jobCompany;

        if (applications.some(function (item) {
            return item.id === jobId;
        })) {
            button.textContent = "✓ Already Applied";
            button.disabled = true;
            return;
        }

        applications.push({
            id: jobId,
            title: jobTitle,
            company: jobCompany,
            url: jobUrl,
            appliedAt: new Date().toISOString()
        });

        try {
            localStorage.setItem(
                "jobpilot_applications_" + user.uid,
                JSON.stringify(applications)
            );
            updateCount(user.uid, applications);
            button.textContent = "✓ Applied";
            button.disabled = true;
        } catch (error) {
            alert("Unable to save application. Please try again.");
        }
    });

    addButtons();

    var results = document.getElementById("jobsResults");
    if (results) {
        new MutationObserver(addButtons).observe(results, {
            childList: true,
            subtree: true
        });
    }
})();
