document.addEventListener("DOMContentLoaded", function () {
    // Function to load content into the #main-content div
    function loadContent(page) {
    const mainContent = document.getElementById("main-content");

    // Fetch the content of the requested page
    fetch(page)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to load content: " + response.statusText);
        }
        return response.text(); // Parse the HTML content as text
        })
        .then((html) => {
        mainContent.innerHTML = html; // Set the content of #main-content
        })
        .catch((error) => {
        console.error(error);
        mainContent.innerHTML = "<p>Sorry, an error occurred while loading the content.</p>";
        });
    }

    // Function to toggle search bar
    function toggleSearchBar(page) {
        const searchBar = document.querySelector(".search-bar");

        if(page === "home_content.html") {
            searchBar.style.visibility = 'visible';
        } else {
            searchBar.style.visibility = 'hidden';
        }
    }

    // Event listeners for navigation buttons (anchor tags)
    document.getElementById("home-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("home_content.html");
        toggleSearchBar("home_content.html");
    });

    document.getElementById("about-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("about_content.html");
        toggleSearchBar("about_content.html");
    });

    document.getElementById("contact-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("contact_content.html");
        toggleSearchBar("contact_content.html");
    });

    // Load the default content (e.g., Home page) when the page first loads
    loadContent("home_content.html");
});
