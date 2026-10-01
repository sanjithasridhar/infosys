"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportDashboard() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch(`/api/experiments/${params.experimentId}/report`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to load report", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReport();
    }, [params.experimentId]);

    const exportPDF = async () => {
        if (!reportRef.current) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.experiment.productName.replace(/\s+/g, "_")}_Research_Report.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading insights...</div>;
    if (!data) return <div className="p-8 text-center text-red-600">Failed to load report data. Ensure analysis is complete.</div>;

    const { experiment, report, personas } = data;
    const sentiment = report.sentiment as { positive: number, neutral: number, negative: number, mixed: number };
    const themes = report.themes as { name: string, description: string }[];

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Research Dashboard</h1>
                    <button
                        onClick={exportPDF}
                        disabled={exporting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                    >
                        {exporting ? "Generating PDF..." : "Download PDF"}
                    </button>
                </div>

                {/* PDF Content Container */}
                <div ref={reportRef} className="bg-white p-10 rounded-lg shadow-sm space-y-8 text-gray-800">
                    <header className="border-b pb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{experiment.productName}</h2>
                        <p className="text-gray-600">{experiment.targetAudience}</p>
                    </header>

                    <section>
                        <h3 className="text-xl font-semibold mb-3">Executive Summary</h3>
                        <p className="leading-relaxed">{report.summary}</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Sentiment Breakdown</h3>
                            <ul className="space-y-2 bg-gray-50 p-4 rounded-md">
                                <li>🟢 Positive: {sentiment.positive}</li>
                                <li>⚪ Neutral: {sentiment.neutral}</li>
                                <li>🟡 Mixed: {sentiment.mixed}</li>
                                <li>🔴 Negative: {sentiment.negative}</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Would Use Product?</h3>
                            <ul className="space-y-2 bg-gray-50 p-4 rounded-md">
                                {personas.map((p: any, idx: number) => (
                                    <li key={idx}>
                                        <strong>{p.name}:</strong> {p.intent?.decision || "N/A"} (Score: {p.intent?.score || "-"})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-3">Key Themes</h3>
                        <div className="space-y-4">
                            {themes.map((theme, idx) => (
                                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold">{theme.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Feature Preferences</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {report.featurePreferences.map((feature: string, idx: number) => (
                                    <li key={idx} className="text-sm">{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Pain Points & Concerns</h3>
                            <ul className="list-disc pl-5 space-y-1 text-red-700">
                                {report.painPoints.map((pain: string, idx: number) => (
                                    <li key={idx} className="text-sm">{pain}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
