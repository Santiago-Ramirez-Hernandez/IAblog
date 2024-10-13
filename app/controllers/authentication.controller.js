import pool from '../data/conexion.js';  // Importar la conexión a la BD
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


async function login(req, res) {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ status: "Error", message: "Usuario o contraseña incorrectos" });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: "Error", message: "Usuario o contraseña incorrectos" });
        }

        // Obtener el rol del usuario
        const roleResult = await pool.query('SELECT RoleName FROM Roles WHERE RoleID = $1', [user.roleid]);
        const roleName = roleResult.rows[0].rolename;

        // Autenticación exitosa, devolver rol y mensaje de éxito
        return res.status(200).json({ 
            status: "Success", 
            message: "Inicio de sesión exitoso",
            role: user.roleid, // Aquí devuelves el ID del rol
            userID: user.userid // Devuelves el UserID del usuario
        });

    } catch (error) {
        console.error('No fue posible iniciar sesión', error);
        res.status(500).json({ status: "Error", message: "Error del servidor" });
    }
}


async function register(req,res){
    const nombre = req.body.nombre;
    const lastname = req.body.lastname;
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!nombre || !lastname || !user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }

  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Verifica si el correo o el nombre de usuario ya están en uso
    const emailExists = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    const userExists = await pool.query('SELECT * FROM Users WHERE Username = $1', [user]);
    
    if (emailExists.rows.length > 0) {
        return res.status(400).json({ status: "Error", message: "El correo electrónico ya está en uso." });
    }
    if (userExists.rows.length > 0) {
        return res.status(400).json({ status: "Error", message: "El nombre de usuario ya está en uso." });
    }

    // Inserción del usuario en la base de datos
    const roleID = 3;  // Por defecto, asignar el rol de lector
    //const userID = uuidv4();
    const registrationDate = new Date().toISOString().split('T')[0];  // Solo la fecha

    await pool.query(
        `INSERT INTO Users (Username, LastName, FirstName, Email, Password, RegistrationDate, RoleID)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user, lastname, nombre, email, hashedPassword, registrationDate, roleID]
    );

    res.status(200).json({ status: "Success", message: "Usuario registrado exitosamente" });
    } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ status: "Error", message: "Error del servidor" });
    }
}

async function getUserProfile(req, res) {
    const userID = req.query.userID;  // O de donde lo estés obteniendo
    console.log('UserID recibido en el backend:', userID);
    if (!userID) {
        return res.status(400).json({ message: "Falta el userID." });
    }

    try {
        const userResult = await pool.query('SELECT Username, FirstName, LastName, Email FROM Users WHERE UserID = $1', [userID]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const user = userResult.rows[0];
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        return res.status(500).json({ message: "Error del servidor" });
    }
}

export const methods = {
    login,register,getUserProfile
}