import express from "express"; 
import pool from './data/conexion.js';
import {methods as authentication} from "./controllers/authentication.controller.js"
//fix para dirname 
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import session from 'express-session';

 

//server 
const app = express(); 
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto: ",app.get("port")); 


//Configuración
app.use(express.static(__dirname + "/public"));
app.use(express.json());
// Configuración para servir archivos estáticos desde la carpeta "pages"
app.use(express.static(__dirname + "/pages"));
app.use(express.json());


//rutas
app.get("/login",(req,res)=>res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",(req,res)=>res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin",(req,res)=>res.sendFile(__dirname + "/pages/admin/admin.html"));
app.get("/index",(req,res)=>res.sendFile(__dirname + "/pages/index.html"));
app.get("/perfil-admin",(req,res)=>res.sendFile(__dirname + "/pages/perfil-admin.html"));
app.get("/perfil-lector",(req,res)=>res.sendFile(__dirname + "/pages/reader/perfil-lector.html"));
app.get("/api/profile", authentication.getUserProfile);
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);

app.use(session({
  secret: 'mi-secreto', // Cambia esto por una clave secreta más fuerte
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Usa secure: true solo si tienes HTTPS
}));

// Ruta para obtener las publicaciones
app.get('/api/publications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Publications');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
});

// Ruta para obtener los cuestionarios
app.get('/api/questionnaires', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Questionnaires');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener cuestionarios:', error);
    res.status(500).json({ message: 'Error al obtener cuestionarios' });
  }
});

// Ruta para obtener los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Ruta para obtener el progreso del usuario
app.get('/api/userProgress', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM UserProgress');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener el progreso del usuarios' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.status(500).json({ message: 'Error al cerrar sesión' });
      }

      // Establece encabezados para evitar caché
      res.set('Cache-Control', 'no-store');
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});


//middleware
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


  function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Usa el middleware para proteger esta ruta
app.get('/perfil-lector', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/pages/reader/perfil-lector.html');
});




  
