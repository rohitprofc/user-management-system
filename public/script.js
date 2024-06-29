document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userList = document.getElementById('userList');
    const userIdInput = document.getElementById('userId');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    const apiUrl = 'http://localhost:3000/users';

    // Fetch users and display them
    const fetchUsers = async () => {
        const response = await fetch(apiUrl);
        const users = await response.json();
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${user.name} (${user.email})
                <button class="edit" data-id="${user.id}">Edit</button>
                <button class="delete" data-id="${user.id}">Delete</button>
            `;
            userList.appendChild(li);
        });
    };

    // Add or update a user
    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = userIdInput.value;
        const name = nameInput.value;
        const email = emailInput.value;

        if (id) {
            // Update user
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
        } else {
            // Create user
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
        }

        userForm.reset();
        fetchUsers();
    });

    // Edit or delete a user
    userList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit')) {
            const id = event.target.dataset.id;
            const response = await fetch(`${apiUrl}/${id}`);
            const user = await response.json();
            userIdInput.value = user.id;
            nameInput.value = user.name;
            emailInput.value = user.email;
        }

        if (event.target.classList.contains('delete')) {
            const id = event.target.dataset.id;
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            fetchUsers();
        }
    });

    // Initial fetch of users
    fetchUsers();
});
