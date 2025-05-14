// Funciones para el modal
function showAddProductModal() {
  const modal = document.getElementById("addProductModal");
  modal.style.display = "block";
}

// Cerrar modal
document.querySelector(".close").onclick = function () {
  document.getElementById("addProductModal").style.display = "none";
};

// Manejar el formulario de agregar producto
document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
      img: document.getElementById("img").value,
      code: Math.random().toString(36).substring(2, 8), // Generar código único
      status: true,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Producto agregado exitosamente");
        window.location.reload();
      } else {
        const error = await response.json();
        alert("Error al agregar el producto: " + error.message);
      }
    } catch (error) {
      alert("Error al agregar el producto: " + error.message);
    }
  });

// Manejar eliminación de productos
document.querySelectorAll(".delete-product-btn").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const productId = button.getAttribute("data-product-id");

    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Producto eliminado exitosamente");
          window.location.reload();
        } else {
          const error = await response.json();
          alert("Error al eliminar el producto: " + error.message);
        }
      } catch (error) {
        alert("Error al eliminar el producto: " + error.message);
      }
    }
  });
});

// Manejar edición de productos
document.querySelectorAll(".edit-product-btn").forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const productId = button.getAttribute("data-product-id");

    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();

      // Llenar el formulario con los datos del producto
      document.getElementById("title").value = product.title;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("stock").value = product.stock;
      document.getElementById("category").value = product.category;
      document.getElementById("img").value = product.img || "";

      // Mostrar el modal
      const modal = document.getElementById("addProductModal");
      modal.style.display = "block";

      // Cambiar el comportamiento del formulario para actualizar en lugar de crear
      const form = document.getElementById("addProductForm");
      form.onsubmit = async (e) => {
        e.preventDefault();

        const formData = {
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          price: parseFloat(document.getElementById("price").value),
          stock: parseInt(document.getElementById("stock").value),
          category: document.getElementById("category").value,
          img: document.getElementById("img").value,
        };

        try {
          const updateResponse = await fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (updateResponse.ok) {
            alert("Producto actualizado exitosamente");
            window.location.reload();
          } else {
            const error = await updateResponse.json();
            alert("Error al actualizar el producto: " + error.message);
          }
        } catch (error) {
          alert("Error al actualizar el producto: " + error.message);
        }
      };
    } catch (error) {
      alert("Error al cargar los datos del producto: " + error.message);
    }
  });
});
