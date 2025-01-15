console.log("Archivo index.js cargado");

const socket = io();

socket.on("connect", () => {
  console.log("Socket conectado con el servidor");
});

socket.on("productos", (data) => {
  console.log("Productos actualizados recibidos", data);
  renderProductos(data);
});

socket.on("productDeleted", (data) => {
  console.log("log de productDeleted", data);
});

socket.on("res", (data) => {
  console.log(data);
});

// funcion para renderizar productos

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = ""; // Limpia el contenedor antes de renderizar

  productos.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `
                        <p>${item.title}</p>
                        <p>${item.price}</p>
                        <p>${item.description}</p>
                        <button> Eliminar </button>
    `;
    contenedorProductos.appendChild(card);
    //agregamos el evento al boton eliminar
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

//Agregamos productos desde el form de realtimehandlebars
document.getElementById("btnEnviar").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("click");
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  console.log("Producto a enviar:", producto);
  socket.emit("agregarProducto", producto);
};
