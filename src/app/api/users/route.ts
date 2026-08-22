import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const pool = await connectDB();

    const result = await pool.request().query("SELECT TOP 10 * FROM users");

    return Response.json(result.recordset);
  } catch (error) {
    return Response.json({ error: "DB error" }, { status: 500 });
  }
}
