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

    // Load data from JSON and create cards dynamically
    function loadCards() {
        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                const cardsContainer = document.getElementById('cards-container');
                
                // Function to create individual cards
                const createCard = (location) => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    // Create Image
                    const img = document.createElement('img');
                    img.src = location.imageUrl;
                    img.alt = location.name;
                    card.appendChild(img);

                    // Create Card Content
                    const cardContent = document.createElement('div');
                    cardContent.classList.add('card-content');

                    // Location Name
                    const cardName = document.createElement('h3');
                    cardName.classList.add('card-name');
                    cardName.textContent = location.name;
                    cardContent.appendChild(cardName);

                    // Description
                    const cardDescription = document.createElement('p');
                    cardDescription.classList.add('card-description');
                    cardDescription.textContent = location.description;
                    cardContent.appendChild(cardDescription);

                    // Visit Button
                    const button = document.createElement('button');
                    button.classList.add('card-button');
                    button.textContent = 'Visit';
                    cardContent.appendChild(button);

                    card.appendChild(cardContent);

                    return card;
                };

                // Loop through cities, temples, and beaches and create cards for each
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        const card = createCard(city);
                        cardsContainer.appendChild(card);
                    });
                });

                data.temples.forEach(temple => {
                    const card = createCard(temple);
                    cardsContainer.appendChild(card);
                });

                data.beaches.forEach(beach => {
                    const card = createCard(beach);
                    cardsContainer.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
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
        loadCards();
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
    loadCards();
});
