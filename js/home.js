document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuToggle");
  const nav = document.getElementById("homeLinks");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  const jobInput = document.getElementById("homeJobSearch");
  const locationInput = document.getElementById("homeLocationSearch");
  const searchButton = document.getElementById("homeSearchButton");

  function updateSearchLink() {
    if (!searchButton) return;

    const params = new URLSearchParams();
    const job = jobInput ? jobInput.value.trim() : "";
    const location = locationInput ? locationInput.value.trim() : "";

    if (job) params.set("skills", job);
    if (location) params.set("location", location);

    const query = params.toString();
    searchButton.href = query ? "jobs.html?" + query : "jobs.html";
  }

  if (jobInput) {
    jobInput.addEventListener("input", updateSearchLink);
  }

  if (locationInput) {
    locationInput.addEventListener("input", updateSearchLink);
  }

  updateSearchLink();
});
