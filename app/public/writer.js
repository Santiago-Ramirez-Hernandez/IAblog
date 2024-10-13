document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar publicaciones
        const publicationsRes = await fetch('/api/publications');
        const publicationsData = await publicationsRes.json();
        updatePublicationsTable(publicationsData);

        // Cargar cuestionarios
        const questionnairesRes = await fetch('/api/questionnaires');
        const questionnairesData = await questionnairesRes.json();
        updateQuestionnairesTable(questionnairesData);

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
