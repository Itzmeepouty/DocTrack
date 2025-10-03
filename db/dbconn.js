const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const server = process.env.DB_SERVER;
const database = process.env.DB_DATABASE;
const encrypt = process.env.DB_ENCRYPT === 'true' ? 'Yes' : 'No';
const trustServerCertificate = process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' ? 'Yes' : 'No';

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${database};Trusted_Connection=Yes;Encrypt=${encrypt};TrustServerCertificate=${trustServerCertificate};`;

// Keep a single pool instance
let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect({ connectionString });
  }
  return pool;
}

async function query(sqlQuery, params = {}) {
  try {
    const poolConn = await getPool();
    const request = poolConn.request();

    for (const [key, value] of Object.entries(params)) {
      request.input(key, sql.VarChar, value); // still forcing VarChar, can be improved later
    }

    const result = await request.query(sqlQuery);
    return result.recordset;
  } catch (err) {
    console.error('SQL error:', err);
    throw err;
  }
}

module.exports = { query, sql };
