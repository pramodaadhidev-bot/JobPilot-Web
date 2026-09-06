(function () {
    "use strict";

    function setupMobileMenu() {
        var isDashboardLayout = document.querySelector(".dashboard");
        var isJobsLayout = document.querySelector(".jobs-page");

        if (!isDashboardLayout && !isJobsLayout) {
            return;
        }

        var sidebar = document.querySelector(".sidebar, .jobs-sidebar");

        if (!sidebar) {
            return;
        }

        if (document.getElementById("mobileMenuButton")) {
            return;
        }

        var button = document.createElement("button");
        button.id = "mobileMenuButton";
        button.className = "mobile-menu-button";
        button.type = "button";
        button.setAttribute("aria-label", "Open navigation");
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = "⋮";

        document.body.appendChild(button);

        var overlay = document.createElement("div");
        overlay.id = "mobileMenuOverlay";
        overlay.className = "mobile-menu-overlay";
        document.body.appendChild(overlay);

        function openMenu() {
            document.body.classList.add("mobile-menu-open");
            button.setAttribute("aria-expanded", "true");
            button.setAttribute("aria-label", "Close navigation");
        }

        function closeMenu() {
            document.body.classList.remove("mobile-menu-open");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-label", "Open navigation");
        }

        button.addEventListener("click", function () {
            if (document.body.classList.contains("mobile-menu-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener("click", closeMenu);

        sidebar.addEventListener("click", function (event) {
            var link = event.target.closest("a");

            if (link && window.innerWidth <= 800) {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupMobileMenu);
    } else {
        setupMobileMenu();
    }
})();
