const mysql = require("mysql2");

//configuracion de la conexion
const conexion = mysql.createConnection({
  host: "127.0.0.1", // servidor local
  user: "root",
  password: "", // Usuario de mysql (por defecto en XAMPP)
  database: "tienda", // Nombre de nuestra BD
});

// Comprobar si la conexion fue exitosa

conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error);
    return;
  }
  console.log("Conexion exitosa con MySQL");
});
// Exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;
