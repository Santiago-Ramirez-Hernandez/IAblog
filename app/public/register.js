document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Usar FormData para obtener los datos del formulario de forma más robusta
    const formData = new FormData(e.target);
  
    const res = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: formData.get('user'),
        nombre: formData.get('nombre'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password')
      })
    });
  
    if (res.ok) {
        const result = await res.json();  // Aquí estás esperando un JSON
        console.log(result);
        alert('Registro exitoso');
        // Redirigir después de 2 segundos
        setTimeout(() => {
        window.location.href = "/perfil-admin";  // Redireccionar a la página de presentación
        }, 2000);

      } else {
        const errorResult = await res.json();  // Manejar error en JSON también
        console.error(errorResult);
        alert('No se pudo concretar el registro');
      }
  });
  