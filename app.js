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

app.post("/people", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const response = await conn.query(
    `INSERT INTO todo(name, description, created_at, updated_at, status) VALUE(?, ?, ?, ?, ?)`,
    [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]
  );
    res.json({ id: parseInt(response.insertId), ...req.body });
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

app.put("/people/:id", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const response = await conn.query(
    `UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=? WHERE id=?`,
    [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status, req.params.id]
  );
    res.json({id: req.params.id, ...req.body});
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

app.delete("/people/:id", async (req, res) => {
  let conn;
  try {

	conn = await pool.getConnection();
	const response = await conn.query(
    `DELETE FROM todo WHERE id=?`,
    [req.params.id]
  );
    res.json({id: req.params.id});
  } catch(error) {
    res.status(500).json({message: "Se rompió el servidor"});
  } finally {
	  if (conn) conn.release();
  }
});

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
