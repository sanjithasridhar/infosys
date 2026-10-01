import { generateJsonWithRetry } from "@/lib/gemini-client";
import { PersonaGenerationSchema } from "@/lib/schemas";

export async function generatePersonas({
    productName,
    productDescription,
    targetAudience,
    researchObjectives,
    count = 6
}: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    researchObjectives: string;
    count?: number;
}) {
    const prompt = `
    Generate ${count} distinctly different synthetic personas for product research.
    
    PRODUCT CONTEXT:
    Name: ${productName}
    Description: ${productDescription}
    Target Audience: ${targetAudience}
    Research Objectives: ${researchObjectives}

    REQUIREMENTS:
    - Return a JSON object with a "personas" array.
    - Each persona must have: name, age (number), gender, occupation, location, personalityTraits (array of strings), behavioralPatterns (array), goals (array), painPoints (array), motivations (array), preferences (array), concerns (array), communicationStyle.
    - Ensure genuine diversity. Do not create ${count} clones.
  `;

    try {
        // Uses the hardened client with built-in retries and JSON parsing
        const parsedJson = await generateJsonWithRetry(prompt, 3);

        // Validate strictly with Zod
        const validatedData = PersonaGenerationSchema.parse(parsedJson);
        return validatedData.personas;
    } catch (error) {
        console.error("Persona Generation Failed:", error);
        throw new Error("Failed to generate valid personas from AI service.");
    }
}
