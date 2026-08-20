const http = require("http");
const { bodyParser } = require("./lib/bodyParser");

let database = [];

// Función para obtener información de la base de datos
function getUsersHandler(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(database));
  res.end();
}

// Función para crear un nuevo usuario en la base de datos
async function createUsersHandler(req, res) {
  try {
    await bodyParser(req);
    console.log(req.body);
    database.push(req.body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(database));
    res.end();
  } catch (error) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Error creating user");
    res.end();
  }
}

// Función para actualizar un usuario existente en la base de datos
async function updateUsersHandler(req, res) {
  try {
    let { url } = req;
    console.log(url);

    let idQuery = url.split("?")[1]; // id=1
    let idKey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];

    if (idKey === "id") {
      await bodyParser(req);

      database[idValue - 1] = req.body;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(database));
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Invalid query parameter");
      res.end();
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid body data was provided", error.message);
    res.end();
  }
}


// Función para eliminar un usuario existente en la base de datos
async function deleteUsersHandler(req, res) {
  let { url } = req;

  let idQuery = url.split("?")[1]; // id=1
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];

  if (idKey === "id") {
    database.splice(idValue - 1, 1);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Delete successfully");
    res.end();
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid query parameter");
    res.end();
  }
}

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // logger
  console.log(`URL: ${url} - Method: ${method}`);

  switch (method) {
    // Método GET
    case "GET":
      if (url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Welcome to the API" }));
        res.end();
      }
      if (url === "/users") {
        getUsersHandler(req, res);
      }
      break;
    // Método POST
    case "POST":
      if (url === "/users") {
        createUsersHandler(req, res);
      }
      break;
    // Método PUT
    case "PUT":
      updateUsersHandler(req, res);
      break;
    // Método DELETE
    case "DELETE":
      deleteUsersHandler(req, res);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found");
      res.end();
      break;
  }
});

server.listen(3000);
console.log("Server listening on port", 3000);
