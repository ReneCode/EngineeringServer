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

  // switch off ssl postgress security on azure

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
  const client = getPostgresClient();
  client.connect();
  const res = await client.query(
    "SELECT * from pg_database WHERE datname = $1",
    [name]
  );
  if (res.rows.length === 0) {
    await client.query(`CREATE DATABASE ${name}`);
  }
};

const createTableIfNotExists = async (tableName: string, fields: string[]) => {
  let res = await pool.query(
    "SELECT table_name from information_schema.tables WHERE table_catalog = $1",
    [tableName]
  );
  if (res.rows.length === 0) {
    const sql = `CREATE TABLE ${tableName} (
        ${fields.join(",")}
      )`;
    await pool.query(sql);
  }
};

const initDatabase = async () => {
  try {
    console.log("#createDatabaseIfNotExists");
    await createDatabaseIfNotExists("engineering");
    console.log("#drop table");
    try {
      await pool.query("DROP TABLE objectstore");
    } catch (err) {}
    console.log("#createTableIfNotExists");
    await createTableIfNotExists("objectstore", [
      "id serial primary key not null",
      "name varchar(200) not null",
      "type varchar(100) not null",
      "data text"
    ]);
    return true;
  } catch (err) {
    console.log(`Error: ${err}`);
    return false;
  }
};

export const selectObjectStores = async (type: string) => {
  const res: { rows: [] } = await pool.query(
    "SELECT id,name FROM objectstore WHERE type = $1",
    [type]
  );
  return res.rows;
};

export const selectObjectStore = async (type: string, id: string) => {
  const res = await pool.query(
    "SELECT id, name, data FROM objectstore WHERE type = $1 AND id = $2",
    [type, id]
  );
  if (res.rows.length > 0) {
    return res.rows[0];
  } else {
    return null;
  }
};

export const createObjectStore = async (
  type: string,
  name: string,
  data?: string
) => {
  const res = await pool.query(
    `INSERT INTO objectstore (type, name, data) VALUES ($1, $2, $3) RETURNING id`,
    [type, name, data]
  );
  if (res.rows.length > 0) {
    return res.rows[0].id;
  } else {
    return null;
  }
};

export const deleteObjectStore = async (type: string, id: string) => {
  const res = await pool.query(
    `DELETE FROM objectstore WHERE type=$1 AND id=$2`,
    [type, id]
  );
};

export const updateObjectStoreData = async (
  type: string,
  id: string,
  data: string
) => {
  const res = await pool.query(
    `UPDATE objectstore SET data=$3 WHERE type=$1 AND id=$2`,
    [type, id, data]
  );
};

// const withTransaction = async (name: string) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     // ...
//     await client.query("COMMIT");
//   } catch (e) {
//     console.log("E:", e);
//     await client.query("ROLLBACK");
//   } finally {
//     client.release();
//   }
// };

const pgUtil = {
  pool,
  getDatabase,
  initDatabase,
  selectObjectStores,
  selectObjectStore,
  createObjectStore,
  deleteObjectStore,
  updateObjectStoreData
};

export default pgUtil;
