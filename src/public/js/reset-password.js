document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById("message");

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      messageDiv.style.display = "block";
      messageDiv.className = "alert alert-danger";
      messageDiv.textContent = "Las contraseñas no coinciden";
      return;
    }

    try {
      const token = window.location.pathname.split("/").pop();
      const response = await fetch("/api/password/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      messageDiv.style.display = "block";
      if (data.status === "success") {
        messageDiv.className = "alert alert-success";
        messageDiv.textContent = "Contraseña actualizada exitosamente";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        messageDiv.className = "alert alert-danger";
        messageDiv.textContent =
          data.message || "Error al restablecer la contraseña";
      }
    } catch (error) {
      messageDiv.style.display = "block";
      messageDiv.className = "alert alert-danger";
      messageDiv.textContent = "Error al procesar la solicitud";
    }
  });
