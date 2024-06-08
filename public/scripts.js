document.addEventListener('DOMContentLoaded', () => {
    // Sign-up form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, email })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Sign up successful! Please log in.');
                    window.location.href = '/login.html';
                } else {
                    alert(data.message || 'Sign up failed.');
                }
            } catch (error) {
                console.error('Error during sign-up:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful');
                    window.location.href = '/search.html';
                } else {
                    alert(data.message || 'Login failed.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const by_city = document.getElementById('by_city').value;
            const by_name = document.getElementById('by_name').value;
            const by_type = document.getElementById('by_type').value;

            try {
                const response = await fetch(`/api/breweries/search?by_city=${by_city}&by_name=${by_name}&by_type=${by_type}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    displaySearchResults(data);
                } else {
                    alert(data.message || 'Search failed.');
                }
            } catch (error) {
                console.error('Error during search:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Display search results
    function displaySearchResults(breweries) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
    
        if (breweries.length === 0) {
            searchResults.innerHTML = '<p>No breweries found.</p>';
            return;
        }
    
        breweries.forEach(brewery => {
            const breweryDiv = document.createElement('div');
            breweryDiv.classList.add('brewery-box');
            breweryDiv.innerHTML = `
                <h3>${brewery.name}</h3>
                <p>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}</p>
                <p>Phone: ${brewery.phone}</p>
                <p>Website: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
            `;
            breweryDiv.addEventListener('click', () => {
                window.location.href = `/brewery.html?id=${brewery.id}`;
            });
            searchResults.appendChild(breweryDiv);
        });
    }

    // Load brewery details
    const breweryDetails = document.getElementById('breweryDetails');
    if (breweryDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const brewery_id = urlParams.get('id');

        fetch(`/api/breweries/${brewery_id}`)
            .then(response => response.json())
            .then(data => {
                breweryDetails.innerHTML = `
                    <h2>${data.name}</h2>
                    <p>Address: ${data.street}, ${data.city}, ${data.state}</p>
                    <p>Phone: ${data.phone}</p>
                    <p>Website: <a href="${data.website_url}" target="_blank">${data.website_url}</a></p>
                    <p>Brewery Type: ${data.brewery_type}
                    <h3>Reviews:</h3>
                    <div id="reviewsContainer" class="review-row">
                    ${data.reviews.map((review, index) => `
                        <div class="review-box">
                            <h4>Rating: ${review.rating}</h4>
                            <p>${review.description}</p>
                        </div>
                        ${(index + 1) % 3 === 0 ? '</div><div class="review-row">' : ''}
                    `).join('')}
                </div>
            `;
                document.getElementById('brewery_id').value = brewery_id;
            })
            .catch(error => console.error('Error fetching brewery details:', error));
    }

    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const brewery_id = document.getElementById('brewery_id').value;
            const rating = document.getElementById('rating').value;
            const description = document.getElementById('description').value;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('/api/breweries/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ brewery_id, rating, description })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Review added successfully!');
                    location.reload();
                } else {
                    alert(data.message || 'Failed to add review.');
                }
            } catch (error) {
                console.error('Error adding review:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Load user's reviews on the home page
    const myReviews = document.getElementById('myReviews');
    if (myReviews) {
        const token = localStorage.getItem('token');

        fetch('/api/users/reviews', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    myReviews.innerHTML = '<p>You have not submitted any reviews yet.</p>';
                } else {
                    // Clear previous content
                    myReviews.innerHTML = '';

                    // Iterate over reviews and create boxes
                    data.forEach(review => {
                        const reviewBox = document.createElement('div');
                        reviewBox.classList.add('review-box');
                        reviewBox.innerHTML = `
                            <h3>Brewery ID: ${review.brewery_id}</h3>
                            <p>Rating: ${review.rating}</p>
                            <p>${review.description}</p>
                        `;
                        myReviews.appendChild(reviewBox);
                    });
                }
            })
            .catch(error => console.error('Error fetching user reviews:', error));
    }
});