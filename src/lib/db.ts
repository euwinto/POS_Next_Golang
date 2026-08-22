import sql from "mssql";

const config: sql.config = {
  user: "sa",
  password: "123456",
  server: "localhost",
  port: 1433,
  database: "POS",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: "SQLEXPRESS", // 🔥 ini WAJIB
  },
};

export async function connectDB() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
}
