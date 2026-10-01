import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import { MemoryExtractionSchema } from "@/lib/schemas";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function extractAndStoreMemory(
    personaId: string,
    question: string,
    response: string
) {
    const model = gemini.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Analyze the following interaction with a synthetic persona and extract highly relevant, long-term research memories. 
    Only extract fundamental preferences, dealbreakers, or strong concerns (e.g., "The persona is highly concerned about data privacy", "The persona prefers simple, one-click interfaces").
    Do not extract conversational filler. If nothing significant was revealed, return an empty array.

    Question asked: "${question}"
    Persona's Response: "${response}"

    Return JSON matching the schema.
  `;

    try {
        const result = await model.generateContent(prompt);
        const parsedJson = JSON.parse(result.response.text());
        const validatedData = MemoryExtractionSchema.parse(parsedJson);

        if (validatedData.memories.length > 0) {
            await prisma.personaMemory.createMany({
                data: validatedData.memories.map(content => ({
                    personaId,
                    content
                }))
            });
        }
    } catch (error) {
        console.error("Memory extraction failed silently:", error);
        // Non-blocking failure: If memory extraction fails, we don't crash the user interaction.
    }
}
