document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userID = localStorage.getItem("userID");
        console.log("UUID del usuario:", userID);  // Asegúrate de que el UUID se ve bien en consola

        if (!userID) {
            console.error("No se encontró el userID.");
            return;
        }

        const res = await fetch(`http://localhost:4000/api/profile?userID=${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            const user = await res.json();
            //document.querySelector('.profile-image').textContent = user.username[0];  // Inicial del nombre de usuario
            document.querySelector('h2').textContent = user.username;
            document.querySelector('.profile-info p:nth-of-type(1)').textContent = `Correo: ${user.email}`;
            document.querySelector('.profile-info p:nth-of-type(2)').textContent = `Nombre: ${user.firstname} ${user.lastname}`;
        } else {
            console.error("No se pudo obtener la información del perfil.");
        }
    } catch (error) {
        console.error("Error al cargar el perfil:", error);
    }
    
    try {
        // Cargar publicaciones
        const publicationsRes = await fetch('/api/publications');
        const publicationsData = await publicationsRes.json();
        updatePublicationsTable(publicationsData);

        // Cargar cuestionarios
        const questionnairesRes = await fetch('/api/questionnaires');
        const questionnairesData = await questionnairesRes.json();
        updateQuestionnairesTable(questionnairesData);

        // Cargar usuarios
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        updateUsersTable(usersData);

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
});

// Función para actualizar la tabla de publicaciones
function updatePublicationsTable(publications) {
    const tableBody = document.querySelector('#publications-table tbody');
    tableBody.innerHTML = ''; // Limpiar tabla
    publications.forEach(pub => {
        const row = `<tr>
                        <td>${pub.title}</td>
                        <td>${pub.categoryID}</td>
                        <td>${pub.authorUserID}</td>
                        <td>${new Date(pub.created_at).toLocaleDateString()}</td>
                        <td>${new Date(pub.updated_at).toLocaleDateString()}</td>
                     </tr>`;
        tableBody.innerHTML += row;
    });
}

// Función para actualizar la tabla de cuestionarios
function updateQuestionnairesTable(questionnaires) {
    const tableBody = document.querySelector('#questionnaires-table tbody');
    tableBody.innerHTML = ''; // Limpiar tabla
    questionnaires.forEach(ques => {
        const row = `<tr>
                        <td>${ques.title}</td>
                        <td>${ques.creatorUserID}</td>
                        <td>${new Date(ques.created_at).toLocaleDateString()}</td>
                        <td>${new Date(ques.updated_at).toLocaleDateString()}</td>
                     </tr>`;
        tableBody.innerHTML += row;
    });
}

// Función para actualizar la tabla de usuarios
function updateUsersTable(users) {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = ''; // Limpiar tabla
    users.forEach(user => {
        const row = `<tr>
                        <td>${user.username}</td>
                        <td>${user.firstname}</td>
                        <td>${user.lastname}</td>
                        <td>${user.roleid}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.registrationdate).toLocaleDateString()}</td>
                     </tr>`;
        tableBody.innerHTML += row;
    });
}
