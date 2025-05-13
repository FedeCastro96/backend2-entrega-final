document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById("message");

    try {
      const response = await fetch("/api/password/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.getElementById("email").value,
        }),
      });

      const data = await response.json();

      messageDiv.style.display = "block";
      if (data.status === "success") {
        messageDiv.className = "alert alert-success";
        messageDiv.textContent =
          "Se ha enviado un correo con las instrucciones para restablecer tu contraseña.";
      } else {
        messageDiv.className = "alert alert-danger";
        messageDiv.textContent =
          data.message || "Error al procesar la solicitud";
      }
    } catch (error) {
      messageDiv.style.display = "block";
      messageDiv.className = "alert alert-danger";
      messageDiv.textContent = "Error al procesar la solicitud";
    }
  });
