// este script está en register.handlebars
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      age: document.getElementById("age").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("/api/sessions/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Usuario registrado correctamente");
        window.location.href = "/login";
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Error en el registro");
      console.error(error);
    }
  });
