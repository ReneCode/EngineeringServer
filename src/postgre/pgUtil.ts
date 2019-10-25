const { Pool, Client } = require("pg");
require("dotenv").config();

const pool = new Pool();

const getPostgresClient = () => {
  let options: any = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: "postgres"
  };

  // const database = "postgres"; // process.env.PGDATABASE;
  // const user = process.env.PGUSER;
  // const password = process.env.PGPASSWORD;
  // const host = process.env.PGHOST;
  // const port = process.env.PGPORT;
  // options = {
  //   connectionString: `host=${host} port=${port} dbname=${database} user=${user} password=${password} sslmode=require`
  // };
  const client = new Client(options);
  return client;
};

const getDatabase = async () => {
  try {
    const client = getPostgresClient();
    client.connect();
    const res = await client.query("SELECT datname from pg_database");
    client.end();
    return res.rows.map((r: any) => r.datname);
  } catch (err) {
    console.log("Error getDatabase:", err);
  }
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
