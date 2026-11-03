const roles = {
    "frontend developer": ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design", "REST APIs"],
    "backend developer": ["JavaScript", "Node.js", "SQL", "REST APIs", "Git", "Authentication", "Database Design"],
    "full stack developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
    "data analyst": ["SQL", "Python", "Excel", "Data Visualization", "Statistics", "Power BI"],
    "python developer": ["Python", "SQL", "Git", "REST APIs", "Testing", "Object-Oriented Programming"],
    "java developer": ["Java", "SQL", "Object-Oriented Programming", "Spring Boot", "REST APIs", "Git"],
    "ui/ux designer": ["Figma", "Wireframing", "Prototyping", "User Research", "Visual Design", "Usability Testing"],
    "devops engineer": ["Linux", "Git", "Docker", "CI/CD", "Cloud Computing", "Scripting", "Kubernetes"],
    "software developer": ["Programming", "Data Structures", "Algorithms", "Git", "SQL", "Testing"]
};

const aliases = {
    "js": "javascript",
    "html5": "html",
    "css3": "css",
    "react.js": "react",
    "reactjs": "react",
    "nodejs": "node.js",
    "node": "node.js",
    "github": "git",
    "oop": "object-oriented programming",
    "powerbi": "power bi"
};

const guides = {
    "HTML": {
        detail: "Learn semantic HTML, headings, links, forms, tables and accessibility. Understand how browsers structure web pages.",
        task: "Build a personal portfolio page with a navigation bar, contact form and project section.",
        resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"
    },
    "CSS": {
        detail: "Study selectors, the box model, Flexbox, Grid, positioning, transitions and responsive layouts.",
        task: "Style your portfolio and create a responsive card layout for desktop and mobile.",
        resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics"
    },
    "JavaScript": {
        detail: "Learn variables, functions, arrays, objects, loops, events, DOM manipulation, promises and async/await.",
        task: "Build an interactive to-do application with add, edit and delete features.",
        resource: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
    },
    "React": {
        detail: "Understand components, JSX, props, state, hooks, event handling and component composition.",
        task: "Build a job dashboard with reusable components and searchable job cards.",
        resource: "https://react.dev/learn"
    },
    "Git": {
        detail: "Learn repositories, commits, branches, merging, remote repositories and resolving conflicts.",
        task: "Upload your portfolio project to GitHub and practise using branches.",
        resource: "https://git-scm.com/doc"
    },
    "Responsive Design": {
        detail: "Study mobile-first design, media queries, flexible grids, relative units and responsive images.",
        task: "Make one website adapt smoothly to mobile, tablet and laptop screens.",
        resource: "https://web.dev/learn/design/"
    },
    "REST APIs": {
        detail: "Understand HTTP methods, status codes, JSON, request headers, API endpoints and error handling.",
        task: "Connect a small application to a public API and display the returned data.",
        resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP"
    },
    "Node.js": {
        detail: "Learn the Node.js runtime, modules, npm, asynchronous programming and Express basics.",
        task: "Build a simple task manager API with create, read, update and delete operations.",
        resource: "https://nodejs.org/en/learn"
    },
    "SQL": {
        detail: "Practise SELECT, WHERE, JOIN, GROUP BY, aggregate functions, subqueries and database relationships.",
        task: "Create an employee database and write queries for departments, salaries and reports.",
        resource: "https://sqlbolt.com/"
    },
    "Python": {
        detail: "Learn variables, data types, conditions, loops, functions, collections, files and exception handling.",
        task: "Write a Python program that reads a CSV file and produces a summary report.",
        resource: "https://docs.python.org/3/tutorial/"
    },
    "Excel": {
        detail: "Study formulas, IF, lookup functions, sorting, filtering, conditional formatting and pivot tables.",
        task: "Create a sales spreadsheet with charts and a pivot-table summary.",
        resource: "https://support.microsoft.com/excel"
    },
    "Data Visualization": {
        detail: "Learn how to select appropriate charts, organize information and communicate insights clearly.",
        task: "Create a dashboard that explains trends in a sample sales dataset.",
        resource: "https://www.data-to-viz.com/"
    },
    "Statistics": {
        detail: "Study mean, median, mode, variance, standard deviation, probability and correlation.",
        task: "Analyze a dataset and explain its central tendencies and relationships.",
        resource: "https://www.khanacademy.org/math/statistics-probability"
    },
    "Power BI": {
        detail: "Learn data importing, Power Query, data modelling, relationships, DAX and interactive dashboards.",
        task: "Build a business performance dashboard from a sample dataset.",
        resource: "https://learn.microsoft.com/en-us/power-bi/"
    },
    "Java": {
        detail: "Study Java syntax, data types, conditions, loops, methods, classes, collections and exceptions.",
        task: "Build a library management application using Java classes.",
        resource: "https://dev.java/learn/"
    },
    "Spring Boot": {
        detail: "Understand dependency injection, controllers, services, repositories and REST API development.",
        task: "Create a CRUD application using Spring Boot and a database.",
        resource: "https://spring.io/guides"
    },
    "Figma": {
        detail: "Learn frames, layers, components, auto layout, styles and collaborative design workflows.",
        task: "Design a mobile application interface with reusable components.",
        resource: "https://help.figma.com/"
    },
    "Wireframing": {
        detail: "Study page structure, information hierarchy, navigation patterns and low-fidelity layouts.",
        task: "Sketch the main screens of a job application website before designing them.",
        resource: "https://www.nngroup.com/articles/wireflows/"
    },
    "Prototyping": {
        detail: "Learn interactive components, navigation flows, transitions and clickable prototype testing.",
        task: "Create a clickable prototype showing a complete user journey.",
        resource: "https://help.figma.com/"
    },
    "User Research": {
        detail: "Study user interviews, surveys, personas, observation and research synthesis.",
        task: "Interview a few users and summarize their needs and common problems.",
        resource: "https://www.nngroup.com/articles/which-ux-research-methods/"
    },
    "Visual Design": {
        detail: "Learn typography, colour theory, spacing, alignment, hierarchy and visual consistency.",
        task: "Redesign a dashboard using a consistent visual system.",
        resource: "https://www.interaction-design.org/literature/topics/visual-design"
    },
    "Usability Testing": {
        detail: "Understand usability tasks, test planning, user observation and identifying friction points.",
        task: "Ask users to complete tasks using your prototype and record their difficulties.",
        resource: "https://www.nngroup.com/articles/usability-testing-101/"
    },
    "Linux": {
        detail: "Learn terminal navigation, file permissions, processes, package management and shell commands.",
        task: "Set up a Linux environment and practise common administration commands.",
        resource: "https://linuxjourney.com/"
    },
    "Docker": {
        detail: "Understand images, containers, Dockerfiles, volumes, networks and container management.",
        task: "Containerize a small web application and run it locally.",
        resource: "https://docs.docker.com/get-started/"
    },
    "CI/CD": {
        detail: "Learn automated testing, build pipelines, deployment workflows and continuous integration.",
        task: "Create a GitHub Actions workflow that checks your project whenever you push code.",
        resource: "https://docs.github.com/en/actions"
    },
    "Cloud Computing": {
        detail: "Study cloud infrastructure, compute, storage, networking, deployment and basic security.",
        task: "Deploy a small application using a cloud platform's introductory resources.",
        resource: "https://aws.amazon.com/training/"
    },
    "Scripting": {
        detail: "Learn shell scripting or Python automation, variables, conditions, loops and command execution.",
        task: "Write a script that automates a repetitive file-management task.",
        resource: "https://www.gnu.org/software/bash/manual/"
    },
    "Kubernetes": {
        detail: "Study clusters, nodes, pods, deployments, services and configuration management.",
        task: "Deploy a sample containerized application in a learning environment.",
        resource: "https://kubernetes.io/docs/tutorials/"
    },
    "Authentication": {
        detail: "Understand authentication, authorization, password security, sessions, tokens and access control.",
        task: "Add secure sign-in and protected routes to a demonstration application.",
        resource: "https://developer.mozilla.org/en-US/docs/Web/Security"
    },
    "Database Design": {
        detail: "Learn entities, attributes, primary keys, foreign keys, normalization and relationships.",
        task: "Design a normalized database for a library or job portal.",
        resource: "https://www.postgresql.org/docs/current/tutorial.html"
    },
    "Testing": {
        detail: "Study test cases, assertions, unit testing, integration testing and debugging.",
        task: "Write automated tests for important functions in a small application.",
        resource: "https://www.freecodecamp.org/news/tag/testing/"
    },
    "Programming": {
        detail: "Choose a programming language and learn variables, conditions, loops, functions and debugging.",
        task: "Build a small application that solves a practical everyday problem.",
        resource: "https://www.freecodecamp.org/learn/"
    },
    "Data Structures": {
        detail: "Study arrays, linked lists, stacks, queues, hash maps, trees and their use cases.",
        task: "Implement basic data structures and solve beginner practice problems.",
        resource: "https://www.geeksforgeeks.org/data-structures/"
    },
    "Algorithms": {
        detail: "Learn time complexity, searching, sorting, recursion and basic problem-solving strategies.",
        task: "Implement linear search, binary search and sorting algorithms.",
        resource: "https://www.khanacademy.org/computing/computer-science/algorithms"
    },
    "Object-Oriented Programming": {
        detail: "Understand classes, objects, encapsulation, inheritance, abstraction and polymorphism.",
        task: "Build a banking or library application using object-oriented principles.",
        resource: "https://www.freecodecamp.org/news/object-oriented-programming-concepts/"
    }
};

const form = document.getElementById("skillGapForm");

function normalize(skill) {
    const value = skill.trim().toLowerCase();
    return aliases[value] || value;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("targetJob").value.trim().toLowerCase();
    const roleName = Object.keys(roles).find(role =>
        title === role || title.includes(role)
    );

    if (!roleName) {
        alert("Role not found. Try Frontend Developer, Backend Developer, Full Stack Developer, Data Analyst, Python Developer, Java Developer, UI/UX Designer, DevOps Engineer or Software Developer.");
        return;
    }

    const entered = document.getElementById("currentSkills").value
        .split(",")
        .map(normalize)
        .filter(Boolean);

    const required = roles[roleName];
    const matched = required.filter(skill => entered.includes(normalize(skill)));
    const missing = required.filter(skill => !entered.includes(normalize(skill)));
    const percentage = Math.round(matched.length / required.length * 100);

    const summary = document.getElementById("matchSummary");
    const matchedBox = document.getElementById("matchedSkills");
    const missingBox = document.getElementById("missingSkills");
    const roadmap = document.getElementById("roadmap");

    summary.replaceChildren();
    matchedBox.replaceChildren();
    missingBox.replaceChildren();
    roadmap.replaceChildren();

    const score = document.createElement("div");
    score.className = "sg-score";
    score.textContent = percentage + "% match";

    const description = document.createElement("p");
    description.textContent = `You have ${matched.length} of ${required.length} suggested skills for ${roleName}.`;
    summary.append(score, description);

    function addChip(container, skill, isMissing) {
        const chip = document.createElement("span");
        chip.className = isMissing ? "sg-chip missing" : "sg-chip";
        chip.textContent = skill;
        container.appendChild(chip);
    }

    matched.forEach(skill => addChip(matchedBox, skill, false));

    if (matched.length === 0) {
        matchedBox.textContent = "No matching skills yet. Start learning!";
    }

    missing.forEach(skill => addChip(missingBox, skill, true));

    if (missing.length === 0) {
        missingBox.textContent = "Excellent! You have all suggested skills.";
        roadmap.textContent = "Keep practising and build projects to demonstrate your skills.";
    } else {
        missing.forEach((skill, index) => {
            const guide = guides[skill] || {
                detail: `Study the fundamentals of ${skill}, understand its common tools and practise applying it.`,
                task: `Build a small project that demonstrates your understanding of ${skill}.`,
                resource: "https://www.freecodecamp.org/learn/"
            };

            const step = document.createElement("article");
            step.className = "sg-step";

            const heading = document.createElement("h3");
            heading.textContent = `Step ${index + 1}: Learn ${skill}`;

            const detail = document.createElement("p");
            detail.textContent = guide.detail;

            const taskTitle = document.createElement("p");
            taskTitle.textContent = "Practice project: " + guide.task;

            const resource = document.createElement("a");
            resource.className = "sg-resource";
            resource.href = guide.resource;
            resource.target = "_blank";
            resource.rel = "noopener noreferrer";
            resource.textContent = "Explore learning resource ↗";

            step.append(heading, detail, taskTitle, resource);
            roadmap.appendChild(step);
        });
    }

    document.getElementById("results").hidden = false;
    document.getElementById("results").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
