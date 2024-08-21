import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { cardId: string } }
) => {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    const auditLog = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(auditLog);
  } catch (error) {
    return new NextResponse("Error in GET card logs", { status: 500 });
  }
};
