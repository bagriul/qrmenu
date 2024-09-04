document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories');
    const dishesContainer = document.getElementById('dishes-container');
    const apiLink = 'https://rnhtb-176-111-183-141.a.free.pinggy.link'
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNTQ2MTY5MSwianRpIjoiNTA4YjliMWUtMzQ1NC00YmRiLWFjODEtZjNmZTM1MzA3Nzk0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3RAZ21haWwuY29tIiwibmJmIjoxNzI1NDYxNjkxLCJjc3JmIjoiNTAzNGNlNDgtZjA1Yi00NWE4LTg3ZjUtNTcwNDI3MjkwMDY3IiwiZXhwIjoxNzI1NDYyNTkxfQ.z5k63ePKdLDlaz4oXZ4Bz11M0ErokOTkHmih-9xNlAE';  // Replace with your actual Bearer token

    // Modal elements
    const modal = document.getElementById('dish-modal');
    const closeModal = document.querySelector('.close');
    const modalDishImg = document.getElementById('modal-dish-img');
    const modalDishName = document.getElementById('modal-dish-name');
    const modalDishPrice = document.getElementById('modal-dish-price');
    const modalDishDescription = document.getElementById('modal-dish-description');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fetch and display categories
    fetch(`${apiLink}/categories`, {
        mode: 'no-cors',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.categories.forEach((category, index) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category-item');
            if (index === 0) {
                categoryDiv.classList.add('active');
                fetchDishes(category.name);  // Fetch dishes for the first category initially
            }
            categoryDiv.textContent = category.name;
            categoryDiv.addEventListener('click', () => {
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('active');
                });
                categoryDiv.classList.add('active');
                fetchDishes(category.name);  // Fetch dishes for the selected category
            });
            categoriesContainer.appendChild(categoryDiv);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));

    // Function to fetch and display dishes based on the selected category
    function fetchDishes(categoryName) {
        fetch(`${apiLink}/dishes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dishesContainer.innerHTML = '';  // Clear previous dishes
            const filteredDishes = data.dishes.filter(dish => dish.category === categoryName);
            filteredDishes.forEach(dish => {
                const dishCard = document.createElement('div');
                dishCard.classList.add('dish-card');

                const dishImg = document.createElement('img');
                dishImg.src = dish.picture_url;
                dishCard.appendChild(dishImg);

                const dishInfo = document.createElement('div');
                dishInfo.classList.add('dish-info');

                const dishName = document.createElement('h3');
                dishName.textContent = dish.name;
                dishInfo.appendChild(dishName);

                const dishPrice = document.createElement('div');
                dishPrice.classList.add('price');
                dishPrice.textContent = `${dish.price} ₪`;
                dishInfo.appendChild(dishPrice);

                const dishDescription = document.createElement('p');
                dishDescription.textContent = dish.description;
                dishInfo.appendChild(dishDescription);

                dishCard.appendChild(dishInfo);
                dishesContainer.appendChild(dishCard);

                // Show modal on dish click
                dishCard.addEventListener('click', () => {
                    modal.style.display = 'block';
                    modalDishImg.src = dish.picture_url;
                    modalDishName.textContent = dish.name;
                    modalDishPrice.textContent = `${dish.price} ₪`;
                    modalDishDescription.textContent = dish.description;
                });
            });
        })
        .catch(error => console.error('Error fetching dishes:', error));
    }
});
