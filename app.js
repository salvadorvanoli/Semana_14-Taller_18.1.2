const express = require("express"); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: "localhost", 
  user: "root", 
  password: "12560", 
  database:"planning",
  connectionLimit: "5"
});

const app = express(); // Crea una instancia de ExpressJS

const port = 3000;

app.use(express.json()); // Permite que el servidor analice el cuerpo de las peticiones como JSON

const people = require("./json/people.json"); // Importa los datos iniciales (generados en https://www.mockaroo.com/)

app.get("/", (req, res) => {
  // El primer parámetro SIEMPRE es asociado a la request (petición) y el segundo a la response (respuesta)
  res.send("<h1>Bienvenid@ al servidor</h1>");
});

app.get("/people", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const rows = await conn.query(
    "SELECT * FROM todo"
  );

    res.json(rows);
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

app.get("/people/:id", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const rows = await conn.query(
    "SELECT * FROM todo WHERE id=?",[req.params.id]
  );

    res.json(rows[0]);
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

// 13:35 del vídeo

app.post("/people", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const res = await conn.query(
    `INSERT INTO todo(id, name, description, created_at, updated_at, satus) VALUE(?, ?, ?, ?, ?, ?);`,
    [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]
  );
    res.json({id: res.inertId, ...req.body});
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

app.put("/people/:id", (req, res) => {
  /* COMPLETA EL CÓDIGO NECESARIO:
    Para que se pueda actualizar el objeto asociado al índice indicado en la URL 
  */

  people[req.params.index] = req.body; // Reemplazo el elemento pasado por parámetro por el nuevo introducido en el body

  res.json(req.body); // Muestro en pantalla el nuevo objeto en formato json
});

app.delete("/people/:id", (req, res) => {
  /* COMPLETA EL CÓDIGO NECESARIO:
    Para que se pueda eliminar el objeto asociado al índice indicado en la URL 
  */

  res.json(people[req.params.index]); // Muestro en pantalla el objeto que va a ser eliminado

  people.splice(req.params.index, 1); // Elimino el elemento del array
});

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
