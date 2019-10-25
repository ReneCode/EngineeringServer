const { Pool, Client } = require("pg");
require("dotenv").config();

const pool = new Pool();

const getPostgresClient = () => {
  const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: "postgres"
  });
  return client;
};

const getDatabase = async () => {
  const client = getPostgresClient();
  client.connect();
  const res = await client.query("SELECT datname from pg_database");
  client.end();
  return res.rows.map((r: any) => r.datname);
};

const createDatabaseIfNotExists = async (name: string) => {
  // create database without transaction
  try {
    const client = getPostgresClient();
    client.connect();
    const res = await client.query(
      "SELECT * from pg_database WHERE datname = $1",
      [name]
    );
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE ${name}`);
    }
    return true;
  } catch (e) {
    console.log("E:", e);
    return false;
  }
};
const withTransaction = async (name: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // ...
    await client.query("COMMIT");
  } catch (e) {
    console.log("E:", e);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const pgUtil = {
  pool,
  getDatabase,
  createDatabaseIfNotExists
};

export default pgUtil;
