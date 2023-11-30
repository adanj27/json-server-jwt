const jsonServer = require('json-server');
const auth = require('json-server-auth');
const jwt = require('jsonwebtoken'); // Añade esta línea

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Configurar reglas de autenticación
server.use(auth);

// Endpoint de inicio de sesión (autenticación)
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar el usuario en la base de datos
  const user = server.db.get('users').find({ email, passowrd }).value();

  if (user) {
    // Generar un token JWT
    const jwtToken = generarTokenJWT(user);
    
    // Devolver el token
    res.json({ token: jwtToken });
  } else {
    // Usuario no encontrado o contraseña incorrecta
    res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }
});

// Función para generar un token JWT
function generarTokenJWT(user) {
  const claveSecreta = 'miClaveSecreta'; // Cambia esto en un entorno de producción
  return jwt.sign({ usuerId: user.id }, claveSecreta, { expiresIn: '1h' });
}

// Iniciar el servidor
server.listen(3000, () => {
  console.log('JSON Server con autenticación y JWT está corriendo en http://localhost:3000');
});

