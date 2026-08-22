// import { connectDB } from "@/lib/db";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     const { username, password, nama, role } = await req.json();

//     const pool = await connectDB();

//     // CHECK USER
//     const check = await pool.request().input("username", username).query(`
//         SELECT *
//         FROM UserID
//         WHERE Username = @username
//       `);

//     if (check.recordset.length > 0) {
//       return Response.json({
//         success: false,
//         message: "Username sudah digunakan",
//       });
//     }

//     // HASH PASSWORD
//     const hashPassword = await bcrypt.hash(password, 10);

//     // INSERT
//     await pool
//       .request()
//       .input("username", username)
//       .input("password", hashPassword)
//       .input("nama", nama)
//       .input("role", role).query(`
//         INSERT INTO UserID
//         (
//           Username,
//           Password,
//           Nama,
//           Role
//         )
//         VALUES
//         (
//           @username,
//           @password,
//           @nama,
//           @role
//         )
//       `);

//     return Response.json({
//       success: true,
//     });
//   } catch (error: any) {
//     // console.error(error);
//     // console.error("REGISTER ERROR :", error);

//     return Response.json(
//       {
//         success: false,
//         message: "Server Error",
//         // error: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// // import { connectDB } from "@/lib/db";

// // export async function POST(req: Request) {
// //   try {
// //     const { username, password, nama } = await req.json();

// //     const pool = await connectDB();

// //     const check = await pool
// //       .request()
// //       .input("username", username)
// //       .query(`SELECT * FROM UserID WHERE Username = @username`);

// //     if (check.recordset.length > 0) {
// //       return Response.json({
// //         success: false,
// //         message: "Username sudah digunakan",
// //       });
// //     }

// //     await pool
// //       .request()
// //       .input("username", username)
// //       .input("password", password)
// //       .input("nama", nama).query(`INSERT INTO UserID (Username, Password, Nama)
// //         VALUES (@username, @password, @nama)`);

// //     return Response.json({
// //       success: true,
// //       //   message: "Register Berhasil",
// //       //   data: JSON.stringify({
// //       //     username: username,
// //       //     password: password,
// //       //     nama: nama,
// //       //   }),
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return Response.json({ success: false }, { status: 500 });
// //   }
// // }

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password, nama, role } = await req.json();

    // =========================
    // VALIDASI
    // =========================
    if (!username || !password || !nama) {
      return Response.json(
        {
          success: false,
          message: "Username, password, dan nama wajib diisi",
        },
        { status: 400 }
      );
    }

    const usernameTrim = username.trim();

    // =========================
    // CHECK USER
    // =========================
    const existingUser = await prisma.userID.findUnique({
      where: {
        Username: usernameTrim,
      },
    });

    if (existingUser) {
      return Response.json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashPassword = await bcrypt.hash(password, 10);

    // =========================
    // INSERT USER
    // =========================
    const user = await prisma.userID.create({
      data: {
        Username: usernameTrim,
        Password: hashPassword,
        Nama: nama,
        Role: role || "KASIR",
        IsActive: true,
        MustChangePassword: false,
        WaktuDibuat: new Date(),
        DibuatOleh: "SYSTEM",
      },
    });

    return Response.json({
      success: true,
      message: "Register berhasil",
      data: {
        ID: user.ID.toString(),
        Username: user.Username,
        Nama: user.Nama,
        Role: user.Role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

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
