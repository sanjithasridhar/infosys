"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function SurveyMode() {
    const params = useParams();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [surveyHistory, setSurveyHistory] = useState<any[]>([]);
    const [personas, setPersonas] = useState<any[]>([]);

    // Fetch personas to map names to responses
    useEffect(() => {
        async function fetchPersonas() {
            try {
                const res = await fetch(`/api/experiments/${params.experimentId}/personas`);
                if (res.ok) {
                    const data = await res.json();
                    setPersonas(data);
                }
            } catch (error) {
                console.error("Failed to fetch personas", error);
            }
        }
        fetchPersonas();
    }, [params.experimentId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/experiments/${params.experimentId}/surveys`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            });

            if (res.ok) {
                const data = await res.json();
                setSurveyHistory(prev => [data, ...prev]);
                setQuestion("");
            } else {
                alert("Survey execution failed. Check terminal for Gemini API errors.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getPersonaContext = (personaId: string) => {
        const p = personas.find(p => p.id === personaId);
        return p ? { name: p.name, traits: p.personalityTraits.slice(0, 2).join(", ") } : { name: "Unknown", traits: "" };
    };

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Mode</h1>
                    <p className="text-gray-600">Ask a question to broadcast it to all synthetic personas simultaneously.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex gap-4">
                    <input
                        type="text"
                        placeholder="e.g., How much would you pay for a monthly premium pet health subscription?"
                        className="flex-1 border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading || personas.length === 0}
                        className="bg-blue-600 text-white font-bold px-8 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Simulating Responses..." : "Ask Personas"}
                    </button>
                </form>

                <div className="space-y-10">
                    {surveyHistory.map((survey, index) => (
                        <div key={survey.question.id || index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                                Q: {survey.question.question}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {survey.responses.map((resp: any) => {
                                    const ctx = getPersonaContext(resp.personaId);
                                    return (
                                        <div key={resp.id} className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex flex-col">
                                            <div className="mb-3 border-b border-gray-200 pb-2">
                                                <span className="font-bold text-gray-900 block">{ctx.name}</span>
                                                <span className="text-xs text-gray-500">{ctx.traits}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 italic leading-relaxed">"{resp.response}"</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
