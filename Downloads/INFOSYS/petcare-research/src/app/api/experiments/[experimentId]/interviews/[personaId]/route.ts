import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { groq } from "@/lib/gemini-client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ experimentId: string; personaId: string }> }
) {
    try {
        const { message } = await request.json();
        const resolvedParams = await params;

        const persona = await prisma.persona.findUnique({
            where: { id: resolvedParams.personaId }
        });

        if (!persona) {
            return NextResponse.json({ error: "Persona not found" }, { status: 404 });
        }

        const systemPrompt = `You are playing the role of a synthetic research participant. 
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}
Traits: ${persona.personalityTraits.join(", ")}
Pain Points: ${persona.painPoints.join(", ")}

Your task is to respond to the researcher's questions IN CHARACTER. Do not break character, do not act like an AI, and do not be overly helpful if it conflicts with your pain points. Keep your answers natural and conversational.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });

        return NextResponse.json({ role: "persona", content: completion.choices[0]?.message?.content }, { status: 200 });

    } catch (error: any) {
        console.error("========== INTERVIEW API CRASH ==========");
        console.error(error);
        return NextResponse.json({ error: "Failed to generate interview response" }, { status: 500 });
    }
}
