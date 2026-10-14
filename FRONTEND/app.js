const API_URL = "http://localhost:3000";

// Elementos del DOM de Productos
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// Elementos del DOM de Contacto
const formContacto = document.getElementById("formularioContacto");
const nombreContactoInput = document.getElementById("nombre");
const correoContactoInput = document.getElementById("correo");
const mensajeContactoInput = document.getElementById("mensaje");
const listaMensajes = document.getElementById("listaMensajes");
const btnConsultarMensajes = document.getElementById("btnConsultarMensajes");

// ==========================================
// SECCIÓN DE PRODUCTOS (Lógica anterior)
// ==========================================

async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML =
        "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function cargarEnFormulario(id, nombre, precio, stock) {
  if (!productoId) return;
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

function cancelarEdicion() {
  if (!formulario) return;
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

async function eliminarProducto(id) {
  const confirmar = confirm(
    "¿Deseas eliminar este producto de la base de datos?",
  );
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    if (productoId && productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// ==========================================
// SECCIÓN DE CONTACTO / MENSAJES (Nuevo)
// ==========================================

// 1. Enviar mensaje de contacto (CREATE)
if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoMensaje = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      mensaje: document.getElementById("mensaje").value,
    };

    try {
      const respuesta = await fetch(`${API_URL}/contactos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMensaje),
      });

      if (respuesta.ok) {
        alert("¡Mensaje de contacto enviado con éxito!");
        formContacto.reset();
        // Si la lista de mensajes está visible en pantalla, la refrescamos automáticamente
        consultarMensajes();
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error de red al enviar mensaje:", error);
    }
  });
}

// 2. Consultar todos los mensajes (READ)
async function consultarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML =
        "<p style='color: #64748b;'>No hay mensajes registrados.</p>";
      return;
    }

    mensajes.forEach((item) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto"); // Reutilizamos la clase de estilo de tarjeta

      elemento.innerHTML = `
        <div>
          <h3>${item.nombre}</h3>
          <p class="producto-precio"><strong>Correo:</strong> ${item.correo}</p>
          <p><strong>Mensaje:</strong> ${item.mensaje}</p>
        </div>
        <div class="acciones">
          <button class="btn-eliminar" onclick="eliminarMensaje(${item.id})">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al consultar mensajes:", error);
    listaMensajes.innerHTML =
      "<p style='color: red;'>Error al conectar con el servidor.</p>";
  }
}

// Asociar el evento al botón de consulta en el HTML
if (btnConsultarMensajes) {
  btnConsultarMensajes.addEventListener("click", consultarMensajes);
}

// 3. Eliminar un mensaje (DELETE)
async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos/${id}`, {
      method: "DELETE",
    });

    if (respuesta.ok) {
      consultarMensajes(); // Refrescar la lista en pantalla
    } else {
      alert("No se pudo eliminar el mensaje.");
    }
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
  }
}

// Llamados iniciales según la página en la que nos encontremos
cargarProductos();
