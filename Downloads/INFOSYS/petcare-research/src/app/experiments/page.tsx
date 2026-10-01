"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateExperiment() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productName: "PetCare AI",
        productDescription: "An application for pet health tracking, nutrition, activity monitoring, and pet adoption.",
        targetAudience: "Urban pet owners and people interested in adopting pets.",
        researchObjectives: "Understand which features are valuable, what concerns users have, and whether they would use the app."
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/experiments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                router.push(`/experiments/${data.id}`);
            } else {
                alert("Generation failed. Check your terminal for Gemini API errors.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Synthetic Research Workspace</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Product Name</label>
                        <input className="w-full border p-3 rounded-md" value={formData.productName} onChange={e => setFormData({ ...formData, productName: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Product Description</label>
                        <textarea className="w-full border p-3 rounded-md h-24" value={formData.productDescription} onChange={e => setFormData({ ...formData, productDescription: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Target Audience</label>
                        <textarea className="w-full border p-3 rounded-md h-20" value={formData.targetAudience} onChange={e => setFormData({ ...formData, targetAudience: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Research Objectives</label>
                        <textarea className="w-full border p-3 rounded-md h-20" value={formData.researchObjectives} onChange={e => setFormData({ ...formData, researchObjectives: e.target.value })} required />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? "Generating Personas via Gemini... (This takes 15-30 seconds)" : "Generate 6 Synthetic Personas"}
                    </button>
                </form>
            </div>
        </main>
    );
}
