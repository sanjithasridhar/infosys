import { z } from "zod";

export const PersonaGenerationSchema = z.object({
    personas: z.array(z.object({
        name: z.string(),
        age: z.number(),
        gender: z.string(),
        occupation: z.string(),
        location: z.string(),
        personalityTraits: z.array(z.string()),
        behavioralPatterns: z.array(z.string()),
        goals: z.array(z.string()),
        painPoints: z.array(z.string()),
        motivations: z.array(z.string()),
        preferences: z.array(z.string()),
        concerns: z.array(z.string()),
        communicationStyle: z.string(),
    }))
});

export type GeneratedPersonas = z.infer<typeof PersonaGenerationSchema>;

export const MemoryExtractionSchema = z.object({
    memories: z.array(z.string()).describe("An array of 0 to 3 highly significant, long-term facts learned about the persona's preferences or concerns from this interaction.")
});

export const PersonaIntentSchema = z.object({
    decision: z.enum(["YES", "MAYBE", "NO"]),
    score: z.number().min(1).max(5),
    reasoning: z.string(),
    keyFactors: z.array(z.string())
});

export const InsightReportSchema = z.object({
    summary: z.string(),
    themes: z.array(z.object({
        name: z.string(),
        description: z.string(),
        supportingResponses: z.array(z.string())
    })),
    sentiment: z.object({
        positive: z.number(),
        neutral: z.number(),
        negative: z.number(),
        mixed: z.number()
    }),
    agreementPatterns: z.array(z.string()),
    disagreementPatterns: z.array(z.string()),
    behavioralTrends: z.array(z.string()),
    painPoints: z.array(z.string()),
    featurePreferences: z.array(z.string()),
    concerns: z.array(z.string())
});
