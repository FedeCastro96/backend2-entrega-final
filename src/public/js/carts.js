// Obtener el ID del carrito de la URL
const cartId = window.location.pathname.split("/").pop();

// Función para actualizar la cantidad de un producto
async function updateQuantity(productId, currentQuantity, change) {
  const newQuantity = currentQuantity + change;

  if (newQuantity < 1) {
    if (confirm("¿Deseas eliminar este producto del carrito?")) {
      await removeProduct(productId);
    }
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la cantidad");
    }

    // Recargar la página para mostrar los cambios
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar la cantidad del producto");
  }
}

// Función para eliminar un producto del carrito
async function removeProduct(productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }

    // Recargar la página para mostrar los cambios
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el producto del carrito");
  }
}

// Función para procesar la compra
async function checkout() {
  const checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Procesando...';

  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al procesar la compra");
    }

    const result = await response.json();

    if (result.status === "success") {
      // Mostrar mensaje de éxito con los productos comprados
      const mensaje = `¡Compra realizada con éxito!\n\nProductos comprados:\n${result.productosComprados
        .map((p) => `- ${p.title} (${p.quantity} unidades)`)
        .join("\n")}`;
      alert(mensaje);
      // Recargar la página para mostrar el carrito vacío
      window.location.reload();
    } else if (result.status === "error" && result.productosSinStock) {
      // Mostrar mensaje de error con los productos sin stock
      const mensaje = `No se pudo completar la compra. Los siguientes productos no tienen stock suficiente:\n\n${result.productosSinStock
        .map((p) => `- ${p.title}`)
        .join("\n")}`;
      alert(mensaje);
    } else {
      throw new Error(result.message || "Error al procesar la compra");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al procesar la compra: " + error.message);
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML =
      '<i class="fas fa-shopping-cart"></i> Comprar ahora';
  }
}

// Función para mostrar mensaje de error de stock
function showStockError(productsWithoutStock) {
  const message = `Los siguientes productos no tienen stock suficiente:\n${productsWithoutStock
    .map((p) => `- ${p.title}`)
    .join("\n")}`;
  alert(message);
}
