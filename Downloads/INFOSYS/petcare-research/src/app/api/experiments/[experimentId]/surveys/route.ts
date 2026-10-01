import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import { buildPersonaContextPrompt } from "@/lib/agents/modules/prompt-builder";
import { extractAndStoreMemory } from "@/lib/agents/memory-agent";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ experimentId: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question } = await request.json();
    if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

    const experiment = await prisma.experiment.findUnique({
        where: { id: resolvedParams.experimentId },
        include: { personas: { include: { memories: true } } }
    });

    if (!experiment) return NextResponse.json({ error: "Experiment not found" }, { status: 404 });

    const surveyQuestion = await prisma.surveyQuestion.create({
        data: { experimentId: experiment.id, question }
    });

    const model = gemini.getGenerativeModel({ model: GEMINI_MODEL });

    // Execute persona responses in parallel
    const responsePromises = experiment.personas.map(async (persona) => {
        const prompt = buildPersonaContextPrompt(persona, experiment, "", question);

        try {
            const result = await model.generateContent(prompt);
            const answer = result.response.text();

            const surveyResponse = await prisma.surveyResponse.create({
                data: {
                    questionId: surveyQuestion.id,
                    personaId: persona.id,
                    response: answer
                }
            });

            // Background process to extract memory
            extractAndStoreMemory(persona.id, question, answer);

            return surveyResponse;
        } catch (error) {
            console.error(`Failed to get response for persona ${persona.name}:`, error);
            return null;
        }
    });

    const responses = (await Promise.all(responsePromises)).filter(Boolean);

    return NextResponse.json({ question: surveyQuestion, responses }, { status: 201 });
}
