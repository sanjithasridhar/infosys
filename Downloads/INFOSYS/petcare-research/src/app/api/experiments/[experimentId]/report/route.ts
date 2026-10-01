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

    const experiment = await prisma.experiment.findUnique({
        where: { id: resolvedParams.experimentId },
        include: {
            user: true,
            report: true,
            personas: {
                include: {
                    intent: true
                }
            }
        }
    });

    if (!experiment || experiment.user.email !== session.user.email) {
        return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    if (!experiment.report) {
        return NextResponse.json({ error: "Report not generated yet" }, { status: 400 });
    }

    return NextResponse.json({
        experiment: {
            productName: experiment.productName,
            targetAudience: experiment.targetAudience,
            researchObjectives: experiment.researchObjectives
        },
        report: experiment.report,
        personas: experiment.personas.map(p => ({
            name: p.name,
            intent: p.intent
        }))
    });
}
