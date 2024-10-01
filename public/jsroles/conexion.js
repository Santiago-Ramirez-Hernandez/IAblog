const {Pool} = require('pg');

const configuracion = {
    user: 'postgres',
    host: 'localhost',
    password: 'mlg+pm7Blc',
    database: 'blog_IA'
};

new Pool(configuracion); 
const pool = new Pool(configuracion);