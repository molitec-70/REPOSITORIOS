const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '0.0.0.0';  // Para que sea accesible desde cualquier IP dentro de Docker/Kubernetes
const port = 3000;

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    // Enviar formulario HTML simple
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form action="/submit" method="POST">
        <label for="name">Nombre:</label><br>
        <input type="text" id="name" name="name"><br><br>
        <label for="id">ID:</label><br>
        <input type="text" id="id" name="id"><br><br>
        <label for="department">Departamento:</label><br>
        <input type="text" id="department" name="department"><br><br>
        <input type="submit" value="Enviar">
      </form>
    `);
  } else if (pathname === '/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Extraer los datos enviados en el formulario
      const params = new URLSearchParams(body);
      const name = params.get('name');
      const id = params.get('id');
      const department = params.get('department');

      // Enviar los datos del formulario como respuesta
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h3>Formulario recibido:</h3>
        <p>Nombre: ${name}</p>
        <p>ID: ${id}</p>
        <p>Departamento: ${department}</p>
      `);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

// Iniciar servidor
server.listen(port, hostname, () => {
  console.log(`Servidor corriendo en http://${hostname}:${port}`);
});

