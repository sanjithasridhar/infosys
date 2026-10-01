import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { analyzePersonaIntent, generateExperimentReport } from "@/lib/agents/analysis-agent";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ experimentId: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const experiment = await prisma.experiment.findUnique({
        where: { id: resolvedParams.experimentId },
        include: {
            personas: {
                include: {
                    memories: true,
                    surveyResponses: { include: { question: true } },
                    interviews: { include: { messages: true } }
                }
            },
            surveyQuestions: true
        }
    });

    if (!experiment) return NextResponse.json({ error: "Experiment not found" }, { status: 404 });

    try {
        // 1. Analyze Persona Intent in parallel
        const intentPromises = experiment.personas.map(async (persona) => {
            const interactions = [
                ...persona.surveyResponses.map(r => `Q: ${r.question.question} | A: ${r.response}`),
                ...persona.interviews.flatMap(i => i.messages.map(m => `${m.role}: ${m.content}`))
            ].join("\n");

            const intentAnalysis = await analyzePersonaIntent(persona, experiment, interactions);

            return prisma.personaIntent.upsert({
                where: { personaId: persona.id },
                update: intentAnalysis,
                create: { ...intentAnalysis, personaId: persona.id }
            });
        });

        await Promise.all(intentPromises);

        // 2. Generate Aggregate Report
        const experimentDataString = JSON.stringify(experiment, null, 2);
        const reportAnalysis = await generateExperimentReport(experimentDataString);

        const savedReport = await prisma.experimentReport.upsert({
            where: { experimentId: experiment.id },
            update: {
                summary: reportAnalysis.summary,
                themes: reportAnalysis.themes,
                sentiment: reportAnalysis.sentiment,
                agreementPatterns: reportAnalysis.agreementPatterns,
                disagreementPatterns: reportAnalysis.disagreementPatterns,
                behavioralTrends: reportAnalysis.behavioralTrends,
                painPoints: reportAnalysis.painPoints,
                featurePreferences: reportAnalysis.featurePreferences,
                concerns: reportAnalysis.concerns
            },
            create: {
                experimentId: experiment.id,
                summary: reportAnalysis.summary,
                themes: reportAnalysis.themes,
                sentiment: reportAnalysis.sentiment,
                agreementPatterns: reportAnalysis.agreementPatterns,
                disagreementPatterns: reportAnalysis.disagreementPatterns,
                behavioralTrends: reportAnalysis.behavioralTrends,
                painPoints: reportAnalysis.painPoints,
                featurePreferences: reportAnalysis.featurePreferences,
                concerns: reportAnalysis.concerns
            }
        });

        return NextResponse.json({ message: "Analysis complete", report: savedReport }, { status: 200 });
    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: "Analysis generation failed" }, { status: 500 });
    }
}
