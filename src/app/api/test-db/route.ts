import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";

export async function GET() {
  const data = await prisma.msKategori.findMany({
    orderBy: {
      ID: "asc",
    },
  });

  return Response.json({
    success: true,
    data: serialize(data),
  });
}
