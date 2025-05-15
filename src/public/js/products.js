// Manejar el evento de agregar al carrito
document.addEventListener("DOMContentLoaded", () => {
  // Agregar event listener a todos los botones de "Agregar al carrito"
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button, index) => {
    // Obtener el ID del producto del botón
    const productId = button.getAttribute("data-product-id");
    console.log(`Botón ${index} - ID del producto:`, productId);

    button.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!productId) {
        console.error("No se encontró el ID del producto en el botón");
        return;
      }

      console.log("Agregando producto al carrito:", productId);

      try {
        // Obtener el ID del carrito actual del usuario
        const userResponse = await fetch("/api/sessions/current");
        const userData = await userResponse.json();

        if (userData.status === "success" && userData.payload?.cart) {
          const cartId = userData.payload.cart;
          console.log("ID del carrito:", cartId);

          // Construir la URL con el ID del producto
          const url = `/api/carts/${cartId}/product/${productId}`;
          console.log("URL de la petición:", url);

          // Guardar el texto original del botón
          const originalText = button.textContent;

          // Cambiar el texto del botón a "Agregando..."
          button.textContent = "Agregando...";
          button.disabled = true;

          // Agregar el producto al carrito
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 1 }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta:", {
              status: response.status,
              statusText: response.statusText,
              body: errorText,
            });
            throw new Error(
              `Error del servidor: ${response.status} ${response.statusText}`
            );
          }

          const result = await response.json();
          console.log("Producto agregado al carrito:", result);

          // Cambiar el texto del botón a "¡Agregado!"
          button.textContent = "¡Agregado!";
          button.style.backgroundColor = "#218838";

          // Actualizar el contador del carrito
          if (window.updateCartCounter) {
            await window.updateCartCounter(cartId);
          }

          // Restaurar el botón después de 1.5 segundos
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = "";
            button.disabled = false;
          }, 1500);
        } else {
          console.error("No se encontró el carrito del usuario:", userData);
        }
      } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        // Restaurar el botón en caso de error
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  });
});
