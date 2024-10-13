document.addEventListener("DOMContentLoaded", async () => {
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
            document.querySelector('.profile-image').textContent = user.username[0];  // Inicial del nombre de usuario
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
        // Cargar progreso del usuario
        const userProgressRes = await fetch('/api/userProgress');
        const userProgressData = await userProgressRes.json();
        updateUserProgressTable(userProgressData);

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }

});

// Función para actualizar la tabla progreso del usuario
function updateUserProgressTable(userProgress) {
    const tableBody = document.querySelector('#userProgress-table tbody');
    tableBody.innerHTML = ''; // Limpiar tabla
    userProgress.forEach(userpro => {
        const row = `<tr>
                        <td>${userpro.questionnaireID}</td>
                        <td>${userpro.correctAnswers}</td>
                        <td>${userpro.medalID}</td>
                        <td>${new Date(userpro.created_at).toLocaleDateString()}</td>
                     </tr>`;
        tableBody.innerHTML += row;
    });
}
