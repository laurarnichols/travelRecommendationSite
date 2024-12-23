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

    const normalizePlural = (word) => {
        // Match a word and remove 's' or 'es' at the end to normalize to singular
        return word.replace(/(ies)$/i, 'y').replace(/(es|s)$/i, ''); 
    };

    const flattenData = (data) => {
        let locations = [];
        
        // Flatten countries -> cities
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            locations.push({
              name: city.name,
              imageUrl: city.imageUrl,
              description: city.description,
              type: 'city'  // Add a type to distinguish between city, temple, beach
            });
          });
        });
      
        // Flatten temples
        data.temples.forEach(temple => {
          locations.push({
            name: temple.name,
            imageUrl: temple.imageUrl,
            description: temple.description,
            type: 'temple'
          });
        });
      
        // Flatten beaches
        data.beaches.forEach(beach => {
          locations.push({
            name: beach.name,
            imageUrl: beach.imageUrl,
            description: beach.description,
            type: 'beach'
          });
        });
      
        return locations;
    };

    function clearCardsAndSearch() {
        document.getElementById('cards-container').innerHTML = "";
        document.getElementById("search").value = "";
    }

    function search(query) {
        const searchBar = document.querySelector('.search-bar');
        
        if (searchBar.classList.contains("show")) {
            toggleSearchMenu();
        }
        
        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                const normalizedQuery = query.toLowerCase()
                                             .split(' ')
                                             . map(word => normalizePlural(word));
                
                
                // Flatten the data first
                const locations = flattenData(data);
                
                const results = locations.filter(location => {
                    const locationName = location.name.toLowerCase();
                    const locationDescription = location.description.toLowerCase();
                    const locationType = location.type.toLowerCase();
                    
                    // Check if any of the normalized query words match the name or description
                    return normalizedQuery.some(word => locationName.includes(word) || locationDescription.includes(word) || locationType.includes(word));
                });

                loadCards(results)
            })
            .catch(error => console.error('Error loading JSON data:', error)); 
    }

    // Load data from JSON and create cards dynamically
    function loadCards(data) {
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.innerHTML = "";
        
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
        if(data.length === 0) {
            const card = document.createElement('div');
            card.classList.add('no-results');
            card.textContent = "No results found.";
            cardsContainer.appendChild(card);
        } else {
            // Loop through locations
            data.forEach(location => {
                const card = createCard(location);
                cardsContainer.appendChild(card);
            });
        }
        
    }


    // Function to toggle search bar
    function toggleSearchBar(page) {
        const searchBar = document.querySelector(".search-bar");
        const searchIcon = document.querySelector(".search-icon");

        if(page === "home_content.html") {
            searchBar.style.visibility = 'visible';
            searchIcon.style.visibility = 'visible';
        } else {
            searchBar.style.visibility = 'hidden';
            searchIcon.style.visibility = 'hidden';
        }
    }

    // Function to toggle the menu on smaller screens
    function toggleHamburgerMenu() {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('active');
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
        const searchBar = document.querySelector('.search-bar');
        searchBar.classList.remove('show');
    }

    function toggleSearchMenu() {
        const searchBar = document.querySelector('.search-bar');
        searchBar.classList.toggle('show');
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('active');
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('show');
    }
      

    // Event listeners for navigation buttons (anchor tags)
    document.getElementById("home-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("home_content.html");
        toggleSearchBar("home_content.html");
        const navbar = document.querySelector('.navbar');
        if (navbar.classList.contains('active')) {
            toggleHamburgerMenu();
        }
        clearCardsAndSearch();
    });

    document.getElementById("about-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("about_content.html");
        toggleSearchBar("about_content.html");
        const navbar = document.querySelector('.navbar');
        if (navbar.classList.contains('active')) {
            toggleHamburgerMenu();
        }
        clearCardsAndSearch();
    });

    document.getElementById("contact-btn").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        loadContent("contact_content.html");
        toggleSearchBar("contact_content.html");
        const navbar = document.querySelector('.navbar');
        if (navbar.classList.contains('active')) {
            toggleHamburgerMenu();
        }
        clearCardsAndSearch();
    });

    document.querySelector(".search-button").addEventListener("click", () => {
        const text = document.getElementById("search").value;
        search(text);
    });

    document.querySelector("#search").addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            const text = document.getElementById("search").value;
            search(text);
        }
    });

    document.querySelector(".clear-button").addEventListener("click", () => {
        clearCardsAndSearch();
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        toggleHamburgerMenu();
    });

    document.querySelector(".search-icon").addEventListener("click", () => {
        toggleSearchMenu();
    });

    // Load the default content (e.g., Home page) when the page first loads
    loadContent("home_content.html");
});
