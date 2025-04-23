document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/sessions/current");
    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }
    const result = await response.json();
    if (result.status === "success") {
      const user = result.payload;
      const userInfoDiv = document.getElementById("userInfo");
      userInfoDiv.innerHTML = ` <div class="card"> <div class="card-body"> <h5
    class="card-title">${user.first_name} ${user.last_name}</h5> <p
    class="card-text"><strong>Email:</strong> ${user.email}</p> <p
    class="card-text"><strong>Edad:</strong> ${user.age}</p> <p
    class="card-text"><strong>Rol:</strong> ${user.role}</p> </div> </div> `;
    }
  } catch (error) {
    console.error("Error al cargar información del usuario:", error);
  }
});
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/sessions/logout");
    const result = await response.json();
    if (result.status === "success") {
      alert("Sesión cerrada correctamente");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});
