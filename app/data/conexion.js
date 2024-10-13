import pg from "pg";

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    password: 'mlg+pm7Blc',
    database: 'blog_IA'
});

export default pool;