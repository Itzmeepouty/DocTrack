const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const server = process.env.DB_SERVER;
const database = process.env.DB_DATABASE;
const encrypt = process.env.DB_ENCRYPT === 'true' ? 'Yes' : 'No';
const trustServerCertificate = process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' ? 'Yes' : 'No';

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${database};Trusted_Connection=Yes;Encrypt=${encrypt};TrustServerCertificate=${trustServerCertificate};`;

async function query(sqlQuery, params = {}) {
  try {
    await sql.connect({ connectionString });

    const request = new sql.Request();
    
    for (const [key, value] of Object.entries(params)) {
      request.input(key, sql.VarChar, params[key]);
    }

    const result = await request.query(sqlQuery);
    return result.recordset;
    
  } catch (err) {
    console.error('SQL error:', err);
    throw err;
  } finally {
    await sql.close();
  }
}

module.exports = { query, sql };
