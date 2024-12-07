    document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Usar FormData para obtener los datos del formulario de forma más robusta
    const formData = new FormData(e.target);
  
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password')
      })
    });
  
    if (res.ok) {
        const result = await res.json();
        console.log(result);
        // Almacenar el userID o token en localStorage o cookies
        localStorage.setItem("userID", result.userID);  // Por ejemplo, almacenar el userID

        // Redirigir basado en el rol del usuario
        if (result.role === 1) {
            setTimeout(() => {
                window.location.href = "/admin/perfil-admin.html";
            }, 1000);
        } else if (result.role === 2) {
            setTimeout(() => {
                window.location.href = "perfil-escritor.html";
            }, 1000);
        } else if (result.role === 3) {
            setTimeout(() => {
                window.location.href = "perfil-lector.html";
            }, 1000);
        }
    } else {
        try {
            const errorResult = await res.json();
            console.error(errorResult);
            alert('Usuario o contraseña incorrectos.');
        } catch (e) {
            alert('Error inesperado en el servidor');
        }
    }    
  });