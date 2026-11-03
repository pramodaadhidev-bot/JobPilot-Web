(function () {
    "use strict";

    window.renderApplicationHistory = function (uid) {
        var box = document.getElementById("recentApplications");
        if (!uid || !box) return;

        var applications = [];
        try {
            applications = JSON.parse(
                localStorage.getItem("jobpilot_applications_" + uid) || "[]"
            );
        } catch (error) {}

        box.innerHTML = "";

        if (!Array.isArray(applications) || applications.length === 0) {
            box.innerHTML =
                '<div class="empty-state compact"><div class="empty-icon">✓</div>' +
                '<h3>No recent applications</h3>' +
                '<p>Your job applications will appear here.</p></div>';
            return;
        }

        applications.slice().reverse().slice(0, 5).forEach(function (app) {
            var item = document.createElement("div");
            item.style.cssText = "padding:14px 18px;border-bottom:1px solid #eee";

            var title = document.createElement("h3");
            title.textContent = app.title || "Job application";

            var company = document.createElement("p");
            company.textContent = app.company || "";

            item.appendChild(title);
            item.appendChild(company);

            if (app.url) {
                var link = document.createElement("a");
                link.href = app.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "View Job";
                item.appendChild(link);
            }

            box.appendChild(item);
        });
    };
})();
