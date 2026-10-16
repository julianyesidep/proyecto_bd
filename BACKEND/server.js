require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importamos la conexión creada en db.js

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectura de datos en formato JSON en el cuerpo (req.body)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});
// RUTAS DE PRODUCTOS
// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res
        .status(500)
        .json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Actualizar un producto existente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql =
    "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res
        .status(500)
        .json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 4. Eliminar un producto (DELETE)
app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

// RUTAS DE CONTACTOS
// 1. Obtener todos los mensajes (READ)
app.get("/contactos", (req, res) => {
  const sql = "SELECT * FROM contactos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res
        .status(500)
        .json({ mensaje: "Error al consultar los mensajes" });
    }
    res.json(resultados);
  });
});

// 2. Crear un nuevo mensaje (CREATE)
app.post("/contactos", (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  const sql =
    "INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)";
  const valores = [nombre, correo, mensaje];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar contacto:", error);
      return res.status(500).json({ mensaje: "Error al enviar el mensaje" });
    }

    res.status(201).json({
      mensaje: "Mensaje enviado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Eliminar un mensaje (DELETE)
app.delete("/contactos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
