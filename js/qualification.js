(function () {
    "use strict";

    const catalogue = [
        ["Undergraduate", [
            "BA", "BA English", "BA Economics", "BA History", "BA Political Science",
            "BA Psychology", "BA Sociology", "BA Geography", "BA Philosophy",
            "BSc", "BSc Mathematics", "BSc Physics", "BSc Chemistry",
            "BSc Computer Science", "BSc Information Technology", "BSc Statistics",
            "BSc Biology", "BSc Zoology", "BSc Botany", "BSc Microbiology",
            "BSc Biotechnology", "BSc Biochemistry", "BSc Nursing",
            "BSc Agriculture", "BSc Environmental Science", "BSc Electronics",
            "BSc Geology", "BSc Forensic Science", "BSc Psychology",
            "BCom", "BCom Accounting", "BCom Finance", "BCom Taxation",
            "BCom Computer Applications", "BBA", "BBA Finance",
            "BBA Marketing", "BBA Human Resources", "BBA International Business",
            "BCA", "BCA Data Science", "BCA Artificial Intelligence",
            "BTech Computer Science", "BTech Information Technology",
            "BTech Artificial Intelligence", "BTech Machine Learning",
            "BTech Data Science", "BTech Cyber Security", "BTech Software Engineering",
            "BTech Electronics", "BTech Electronics and Communication",
            "BTech Electrical Engineering", "BTech Mechanical Engineering",
            "BTech Civil Engineering", "BTech Chemical Engineering",
            "BTech Biotechnology", "BTech Biomedical Engineering",
            "BTech Automobile Engineering", "BTech Aerospace Engineering",
            "BTech Aeronautical Engineering", "BTech Agricultural Engineering",
            "BTech Food Technology", "BTech Instrumentation",
            "BTech Robotics", "BTech Mechatronics", "BTech Mining Engineering",
            "BE Computer Science", "BE Information Technology",
            "BE Mechanical Engineering", "BE Civil Engineering",
            "BE Electrical Engineering", "BE Electronics Engineering",
            "B.Arch", "B.Des", "B.Pharm", "Pharm D", "B.Ed",
            "B.P.Ed", "BPT", "BOT", "MBBS", "BDS", "BAMS", "BHMS",
            "BUMS", "BVSc", "LLB", "BSW", "BHM", "BFA"
        ]],
        ["Postgraduate", [
            "MA", "MA English", "MA Economics", "MA History",
            "MA Political Science", "MA Psychology", "MA Sociology",
            "MA Geography", "MA Journalism", "MA Education",
            "MSc", "MSc Mathematics", "MSc Physics", "MSc Chemistry",
            "MSc Computer Science", "MSc Information Technology",
            "MSc Statistics", "MSc Data Science", "MSc Artificial Intelligence",
            "MSc Biotechnology", "MSc Microbiology", "MSc Biochemistry",
            "MSc Zoology", "MSc Botany", "MSc Nursing", "MSc Agriculture",
            "MSc Environmental Science", "MSc Electronics",
            "MCom", "MCom Finance", "MCom Accounting", "MCom Taxation",
            "MBA", "MBA Finance", "MBA Marketing", "MBA Human Resources",
            "MBA Operations", "MBA Business Analytics", "MBA International Business",
            "MBA Healthcare Management", "MBA Information Systems",
            "MCA", "MCA Data Science", "MCA Artificial Intelligence",
            "MTech Computer Science", "MTech Information Technology",
            "MTech Artificial Intelligence", "MTech Data Science",
            "MTech Cyber Security", "MTech Software Engineering",
            "MTech Electronics", "MTech VLSI", "MTech Electrical Engineering",
            "MTech Mechanical Engineering", "MTech Civil Engineering",
            "MTech Structural Engineering", "MTech Chemical Engineering",
            "MTech Biotechnology", "MTech Biomedical Engineering",
            "MTech Robotics", "MTech Renewable Energy",
            "ME Computer Science", "ME Mechanical Engineering",
            "ME Civil Engineering", "ME Electrical Engineering",
            "ME Electronics Engineering", "M.Arch", "M.Des", "M.Pharm",
            "M.Ed", "M.P.Ed", "MSW", "LLM", "MD", "MS Surgery",
            "MPH", "MPT", "MDS", "MVSc", "MFA", "MHM"
        ]],
        ["Doctoral and Research", [
            "PhD", "PhD Computer Science", "PhD Information Technology",
            "PhD Artificial Intelligence", "PhD Data Science",
            "PhD Mathematics", "PhD Applied Mathematics", "PhD Statistics",
            "PhD Physics", "PhD Chemistry", "PhD Biology", "PhD Zoology",
            "PhD Botany", "PhD Biotechnology", "PhD Microbiology",
            "PhD Biochemistry", "PhD Environmental Science",
            "PhD Agriculture", "PhD Nursing", "PhD Medicine",
            "PhD Engineering", "PhD Mechanical Engineering",
            "PhD Civil Engineering", "PhD Electrical Engineering",
            "PhD Electronics Engineering", "PhD Chemical Engineering",
            "PhD Management", "PhD Commerce", "PhD Economics",
            "PhD English", "PhD Education", "PhD Psychology",
            "PhD Sociology", "PhD Political Science", "PhD Law",
            "Doctor of Business Administration (DBA)",
            "MPhil"
        ]],
        ["Diploma and Professional", [
            "Diploma", "Diploma Computer Science", "Diploma Information Technology",
            "Diploma Mechanical Engineering", "Diploma Civil Engineering",
            "Diploma Electrical Engineering", "Diploma Electronics Engineering",
            "Diploma Automobile Engineering", "Diploma Nursing",
            "Diploma Pharmacy", "Diploma Hotel Management",
            "Diploma Accounting", "Diploma Graphic Design",
            "Polytechnic", "ITI", "ITI Electrician", "ITI Fitter",
            "ITI Welder", "ITI Mechanic", "ITI Electronics",
            "CA", "CMA", "CS", "CFA", "ACCA", "CPA",
            "PG Diploma", "PG Diploma Data Science",
            "PG Diploma Human Resources", "PG Diploma Journalism",
            "PG Diploma Management", "Professional Certification",
            "Other qualification"
        ]],
        ["School", [
            "10th Standard", "12th Standard", "Higher Secondary",
            "Plus Two", "A Level", "High School Diploma"
        ]]
    ];

    const input = document.getElementById("jobQualification") || document.getElementById("profileQualification");
    const suggestions = document.getElementById("qualificationSuggestions");
    const selectedBox = document.getElementById("selectedQualifications");

    if (!input || !suggestions || !selectedBox) return;

    const selected = [];

    function renderSelected() {
        selectedBox.replaceChildren();

        selected.forEach(function (item, index) {
            const tag = document.createElement("span");
            tag.className = "qualification-tag";
            tag.textContent = item + " ";

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "×";
            remove.setAttribute("aria-label", "Remove " + item);
            remove.addEventListener("click", function () {
                selected.splice(index, 1);
                renderSelected();
            });

            tag.appendChild(remove);
            selectedBox.appendChild(tag);
        });
    }

    function addQualification(value) {
        const item = String(value || "").trim();
        if (!item) return;

        if (!selected.some(function (entry) {
            return entry.toLowerCase() === item.toLowerCase();
        })) {
            selected.push(item);
        }

        input.value = "";
        suggestions.style.display = "none";
        renderSelected();
    }

    function showSuggestions(query) {
        suggestions.replaceChildren();

        const search = query.trim().toLowerCase();
        if (!search) {
            suggestions.style.display = "none";
            return;
        }

        let count = 0;

        catalogue.forEach(function (group) {
            const matches = group[1].filter(function (degree) {
                return degree.toLowerCase().includes(search);
            });

            if (!matches.length) return;

            const heading = document.createElement("div");
            heading.className = "qualification-group-title";
            heading.textContent = group[0];
            suggestions.appendChild(heading);

            matches.slice(0, 80).forEach(function (degree) {
                if (count >= 100) return;

                const option = document.createElement("button");
                option.type = "button";
                option.className = "qualification-option";
                option.textContent = degree;
                option.addEventListener("click", function () {
                    addQualification(degree);
                });

                suggestions.appendChild(option);
                count++;
            });
        });

        const custom = document.createElement("button");
        custom.type = "button";
        custom.className = "qualification-option qualification-custom";
        custom.textContent = 'Add custom qualification: "' + query.trim() + '"';
        custom.addEventListener("click", function () {
            addQualification(query);
        });
        suggestions.appendChild(custom);

        suggestions.style.display = "block";
    }

    input.addEventListener("input", function () {
        showSuggestions(input.value);
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && input.value.trim()) {
            event.preventDefault();
            addQualification(input.value);
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".qualification-field")) {
            suggestions.style.display = "none";
        }
    });

    window.JobPilotQualifications = {
        getSelected: function () {
            return selected.slice();
        },
        clear: function () {
            selected.length = 0;
            renderSelected();
        },
        add: addQualification,
        getLevel: function (value) {
            const item = String(value || "").trim().toLowerCase();
            for (let i = 0; i < catalogue.length; i++) {
                if (catalogue[i][1].some(function (degree) {
                    return degree.toLowerCase() === item;
                })) {
                    if (i === 0) return 1;
                    if (i === 1) return 2;
                    if (i === 2) return 3;
                    if (i === 4) return 0;
                    return -1;
                }
            }
            return -1;
        },
        getHighestLevel: function () {
            let highest = -1;
            selected.forEach(function (item) {
                const level = this.getLevel(item);
                if (level > highest) highest = level;
            }, this);
            return highest;
        }
    };
})();
