export async function generateJsonWithRetry(prompt: string, retries: number = 3) {
    console.log("[LOCAL BYPASS] Generating mock personas locally...");

    // Simulate an 800ms network delay so the Next.js loading state fires correctly
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        personas: [
            {
                name: "Maya Patel",
                age: 29,
                gender: "Female",
                occupation: "UX Designer",
                location: "Bengaluru, India",
                personalityTraits: ["Empathetic", "Organized", "Tech-savvy"],
                behavioralPatterns: ["Checks phone constantly", "Schedules everything"],
                goals: ["Keep her indoor cat mentally stimulated", "Find premium pet food"],
                painPoints: ["Limited space for pet activities", "High cost of pet care in the city"],
                motivations: ["Deep bond with her cat", "Convenience"],
                preferences: ["Aesthetically pleasing UI", "Quick task completion"],
                concerns: ["App notifications being too spammy"],
                communicationStyle: "Warm and concise"
            },
            {
                name: "Marcus Johnson",
                age: 64,
                gender: "Male",
                occupation: "Retired Teacher",
                location: "Suburban Home",
                personalityTraits: ["Patient", "Routine-oriented", "Cautious"],
                behavioralPatterns: ["Takes daily morning walks", "Prefers desktop over mobile"],
                goals: ["Manage his senior dog's medication schedule", "Track daily exercise"],
                painPoints: ["Finds modern apps overly complicated", "Forgetful about vet appointments"],
                motivations: ["Ensuring his dog's longevity", "Peace of mind"],
                preferences: ["Large text", "Simple navigation", "Email reminders"],
                concerns: ["Accidentally subscribing to premium features", "Data privacy"],
                communicationStyle: "Formal and detailed"
            },
            {
                name: "Samira Al-Fayed",
                age: 34,
                gender: "Female",
                occupation: "Freelance Photographer",
                location: "Nomadic / Van Life",
                personalityTraits: ["Adventurous", "Independent", "Spontaneous"],
                behavioralPatterns: ["Travels frequently", "Relies heavily on mobile data"],
                goals: ["Find pet-friendly trails", "Keep digital vet records accessible anywhere"],
                painPoints: ["Losing signal when trying to access pet data", "Finding emergency vets in new cities"],
                motivations: ["Exploring the world with her dog", "Efficiency"],
                preferences: ["Offline mode support", "Location-based features"],
                concerns: ["Battery drain from background location tracking"],
                communicationStyle: "Casual and direct"
            },
            {
                name: "David Chen",
                age: 26,
                gender: "Male",
                occupation: "Financial Analyst",
                location: "Downtown Condo",
                personalityTraits: ["Analytical", "Anxious", "Data-driven"],
                behavioralPatterns: ["Researches purchases heavily", "Uses spreadsheets for tracking"],
                goals: ["Ensure his new puppy is hitting growth milestones", "Optimize pet food spending"],
                painPoints: ["Overwhelmed by conflicting pet care advice", "Struggles with puppy training consistency"],
                motivations: ["Wants to be the perfect pet parent", "Measurable progress"],
                preferences: ["Data visualization", "Integration with calendar apps"],
                concerns: ["Hidden costs in the app"],
                communicationStyle: "Inquisitive and factual"
            },
            {
                name: "Elena Rodriguez",
                age: 42,
                gender: "Female",
                occupation: "Veterinarian Technician",
                location: "Rural Area",
                personalityTraits: ["Knowledgeable", "Pragmatic", "Skeptical"],
                behavioralPatterns: ["Fosters multiple animals", "Ignores generic advice"],
                goals: ["Manage multiple pet profiles efficiently", "Track complex medical histories"],
                painPoints: ["Apps that offer inaccurate medical AI advice", "Clunky interfaces for switching profiles"],
                motivations: ["High standard of animal welfare", "Professional curiosity"],
                preferences: ["Advanced manual entry options", "Exportable PDF reports"],
                concerns: ["AI giving dangerous medical advice to normal users"],
                communicationStyle: "Blunt and professional"
            },
            {
                name: "Jordan Taylor",
                age: 20,
                gender: "Non-binary",
                occupation: "College Student",
                location: "Shared Housing",
                personalityTraits: ["Social", "Budget-conscious", "Energetic"],
                behavioralPatterns: ["Relies on community advice", "Shares pet duties with roommates"],
                goals: ["Coordinate dog walking with roommates", "Find affordable pet supplies"],
                painPoints: ["Tight budget", "Unpredictable class schedule"],
                motivations: ["Giving their rescue dog a good life", "Social connection"],
                preferences: ["Multi-user account access", "Gamification features"],
                concerns: ["App being entirely locked behind a paywall"],
                communicationStyle: "Enthusiastic and informal"
            }
        ]
    };
}