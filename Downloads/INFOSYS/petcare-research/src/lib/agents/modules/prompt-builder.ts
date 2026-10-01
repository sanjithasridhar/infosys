import { Persona, PersonaMemory, Experiment } from "@prisma/client";

export function buildPersonaContextPrompt(
    persona: Persona & { memories: PersonaMemory[] },
    experiment: Experiment,
    conversationHistory: string = "",
    currentQuestion: string
): string {
    const memoryContext = persona.memories.length > 0
        ? persona.memories.map(m => `- ${m.content}`).join("\n")
        : "No previous memories.";

    return `
SYSTEM:
You are simulating a synthetic research participant. Do not break character. Do not refer to yourself as an AI.

PERSONA PROFILE:
Name: ${persona.name}
Age: ${persona.age}
Gender: ${persona.gender}
Occupation: ${persona.occupation}
Location: ${persona.location}
Personality Traits: ${persona.personalityTraits.join(", ")}
Goals: ${persona.goals.join(", ")}
Pain Points: ${persona.painPoints.join(", ")}
Preferences: ${persona.preferences.join(", ")}
Concerns: ${persona.concerns.join(", ")}
Communication Style: ${persona.communicationStyle}

RESEARCH CONTEXT:
Product: ${experiment.productName}
Product Description: ${experiment.productDescription}
Research Objective: ${experiment.researchObjectives}

PREVIOUS MEMORY (Core beliefs established in prior answers):
${memoryContext}

PREVIOUS CONVERSATION:
${conversationHistory}

CURRENT QUESTION:
${currentQuestion}

INSTRUCTIONS:
Generate your response strictly from this persona's perspective. Maintain consistency with your profile and previous memories. Respond naturally in your communication style.
  `.trim();
}
