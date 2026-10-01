import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generatePersonas } from "@/lib/agents/persona-agent";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        let user = await prisma.user.findFirst({ where: { email: "researcher@petcare.local" } });
        if (!user) {
            user = await prisma.user.create({ data: { email: "researcher@petcare.local", name: "Lead Researcher" } });
        }

        const { productName, productDescription, targetAudience, researchObjectives } = await request.json();

        console.log("Starting Persona Generation via Gemini...");

        const syntheticPersonas = await generatePersonas({
            productName,
            productDescription,
            targetAudience,
            researchObjectives,
            count: 6
        });

        console.log("Persona Generation Successful. Saving to database...");

        const experiment = await prisma.experiment.create({
            data: {
                userId: user.id,
                productName,
                productDescription,
                targetAudience,
                researchObjectives,
                personas: {
                    create: syntheticPersonas
                }
            },
            include: {
                personas: true
            }
        });

        console.log("Experiment Saved Successfully:", experiment.id);
        return NextResponse.json(experiment, { status: 201 });

    } catch (error: any) {
        // Aggressive logging to expose the exact failure
        console.error("========== EXPERIMENT CREATION FAILED ==========");
        console.error("Error Message:", error.message);
        if (error.stack) console.error("Stack Trace:", error.stack);
        console.error("================================================");

        return NextResponse.json({ error: error.message || "Persona generation failed" }, { status: 500 });
    }
}
