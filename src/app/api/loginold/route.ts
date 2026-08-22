import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const pool = await connectDB();

    // CHECK USER
    const result = await pool.request().input("username", username).query(`
        SELECT *
        FROM UserID
        WHERE Username = @username
      `);

    // USER TIDAK ADA
    if (result.recordset.length === 0) {
      return Response.json({
        success: false,
        message: "Username tidak ditemukan",
      });
    }

    const user = result.recordset[0];

    // CHECK PASSWORD
    const valid = await bcrypt.compare(password, user.Password);

    if (!valid) {
      return Response.json({
        success: false,
        message: "Password salah",
      });
    }

    // SAVE SESSION COOKIE
    cookies().set("session_user", user.Username);

    return Response.json({
      success: true,
      user: {
        username: user.Username,
        nama: user.Nama,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

// import { connectDB } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { username, password } = await req.json();

//     const pool = await connectDB();

//     const result = await pool
//       .request()
//       .input("username", username)
//       .input("password", password).query(`
//         SELECT * FROM UserID
//         WHERE Username = @username AND Password = @password
//       `);

//     if (result.recordset.length > 0) {
//       return Response.json({
//         success: true,
//         user: result.recordset[0],
//       });
//     } else {
//       return Response.json({
//         success: false,
//         message: "Username atau password salah",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false }, { status: 500 });
//   }
// }
