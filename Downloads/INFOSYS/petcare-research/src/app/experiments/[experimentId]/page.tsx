import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ExperimentDashboard({
    params
}: {
    params: Promise<{ experimentId: string }>
}) {
    // Unwrap the Next.js 15 params Promise
    const resolvedParams = await params;

    const experiment = await prisma.experiment.findUnique({
        where: { id: resolvedParams.experimentId },
        include: { personas: true }
    });

    if (!experiment) return <div className="p-8 text-red-500 font-bold text-center">Experiment not found.</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-900">{experiment.productName}</h1>
                    <p className="text-gray-600 mt-2 text-lg"><strong>Target Audience:</strong> {experiment.targetAudience}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiment.personas.map(persona => (
                        <div key={persona.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-5">
                            <div className="border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-900">{persona.name}, {persona.age}</h2>
                                <p className="text-sm text-gray-500 mt-1">{persona.occupation} • {persona.location}</p>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">Personality & Traits</span>
                                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md">{persona.personalityTraits.join(" • ")}</p>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2 block">Primary Goals</span>
                                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                                    {persona.goals.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2 block">Pain Points & Concerns</span>
                                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                                    {persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
