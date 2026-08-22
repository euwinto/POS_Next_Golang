import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("session_user");

  return Response.json({
    username: session?.value || null,
  });
}
