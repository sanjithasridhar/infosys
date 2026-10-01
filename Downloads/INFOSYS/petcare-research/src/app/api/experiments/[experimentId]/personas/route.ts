import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ experimentId: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership of the experiment
    const experiment = await prisma.experiment.findUnique({
        where: { id: resolvedParams.experimentId },
        include: { user: true }
    });

    if (!experiment || experiment.user.email !== session.user.email) {
        return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const personas = await prisma.persona.findMany({
        where: { experimentId: resolvedParams.experimentId },
        include: { memories: true },
        orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(personas);
}
