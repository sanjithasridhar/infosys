import { gemini, GEMINI_MODEL } from "@/lib/gemini";
import { PersonaIntentSchema, InsightReportSchema } from "@/lib/schemas";

export async function analyzePersonaIntent(persona: any, experiment: any, interactions: string) {
    const model = gemini.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Based on the persona profile, previous responses, research context, and product description, determine the persona's simulated product-use intention.
    
    PRODUCT: ${experiment.productName}
    DESCRIPTION: ${experiment.productDescription}
    
    PERSONA: ${persona.name} (Age ${persona.age}, ${persona.occupation})
    TRAITS: ${persona.personalityTraits.join(", ")}
    MEMORIES: ${persona.memories.map((m: any) => m.content).join(" | ")}
    
    INTERACTIONS:
    ${interactions}
    
    Return JSON with: decision ("YES", "MAYBE", "NO"), score (1-5), reasoning, and keyFactors (array of strings).
    Remember: The score represents the synthetic persona's simulated response, not a scientifically validated prediction.
  `;

    const result = await model.generateContent(prompt);
    return PersonaIntentSchema.parse(JSON.parse(result.response.text()));
}

export async function generateExperimentReport(experimentData: string) {
    const model = gemini.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Analyze the following complete research experiment data (personas, surveys, and interviews).
    Identify recurring themes, sentiment patterns, areas of agreement/disagreement, and behavioral trends.
    
    DATA:
    ${experimentData}
    
    Return JSON adhering strictly to the structured output requirements.
  `;

    const result = await model.generateContent(prompt);
    return InsightReportSchema.parse(JSON.parse(result.response.text()));
}
