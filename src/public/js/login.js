// Manejar el envío del formulario de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
      // Redirigir a productos después de un login exitoso
      window.location.href = "/products";
    } else {
      // Mostrar error en un alert
      alert(`Error: ${result.error || "Error en el login"}`);
    }
  } catch (error) {
    console.error("Error en el login:", error);
    alert("Error en el login. Por favor, intenta nuevamente.");
  }
});
