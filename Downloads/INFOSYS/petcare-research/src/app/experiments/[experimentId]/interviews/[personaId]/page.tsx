"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function InterviewMode() {
    const params = useParams();
    const [persona, setPersona] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPersona() {
            try {
                const res = await fetch(`/api/experiments/${params.experimentId}/personas`);
                if (res.ok) {
                    const data = await res.json();
                    const targetPersona = data.find((p: any) => p.id === params.personaId);
                    setPersona(targetPersona);
                }
            } catch (error) {
                console.error("Failed to fetch persona", error);
            }
        }
        fetchPersona();
    }, [params.experimentId, params.personaId]);

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = message;
        setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`/api/experiments/${params.experimentId}/interviews/${params.personaId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg })
            });

            if (res.ok) {
                const data = await res.json();
                setChatHistory(prev => [...prev, { role: "persona", content: data.content }]);
            } else {
                alert("Message failed. Check terminal for Gemini API errors.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (!persona) return <div className="p-8 text-center text-gray-500">Loading persona profile...</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[85vh]">

                {/* Header */}
                <header className="bg-blue-600 p-6 text-white shrink-0">
                    <h1 className="text-2xl font-bold">Interviewing: {persona.name}</h1>
                    <p className="text-blue-100 text-sm mt-1">{persona.age} yrs • {persona.occupation} • {persona.personalityTraits.slice(0, 3).join(", ")}</p>
                </header>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {chatHistory.length === 0 ? (
                        <p className="text-center text-gray-400 italic mt-10">Start the conversation. Ask {persona.name} about their pet care habits, concerns, or thoughts on your product.</p>
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] p-4 rounded-xl shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                                    <span className="text-xs font-bold block mb-1 opacity-75">
                                        {msg.role === "user" ? "You (Researcher)" : persona.name}
                                    </span>
                                    <p className="leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 p-4 rounded-xl rounded-bl-none shadow-sm text-gray-500 italic text-sm">
                                {persona.name} is typing...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-4">
                    <input
                        type="text"
                        placeholder={`Ask ${persona.name} a question...`}
                        className="flex-1 border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="bg-blue-600 text-white font-bold px-8 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
}
