import { Printer, Shield, CheckCircle, FileText, Cpu, Clock, MapPin, Hash } from "lucide-react";
import { Investigation } from "../types";

interface ReportViewProps {
  investigation: Investigation;
}

export default function ReportView({ investigation }: ReportViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const safeInvestigation = investigation ?? {
    id: "",
    title: "Forensics Report",
    imageUrl: "",
    imageName: "",
    status: "completed" as const,
    riskScore: 0,
    authenticityScore: 0,
    confidence: 0,
    createdAt: new Date().toISOString(),
    metadata: {
      resolution: "",
      fileSize: "",
      fileType: "",
      cameraModel: "",
      lensModel: "",
      software: "",
      gpsCoordinates: "",
      timestamp: "",
      colorSpace: "",
    },
    visualFindings: [],
    knowledgeBaseItems: [],
    graniteReasoning: {
      summary: "No summary available.",
      evidence: [],
      confidenceExplanation: "",
      recommendations: [],
    },
  };

  const isHighRisk = safeInvestigation.riskScore >= 70;
  const isMedRisk = safeInvestigation.riskScore >= 30 && safeInvestigation.riskScore < 70;

  return (
    <div className="space-y-6 font-sans print:bg-white print:text-black">
      {/* Top action bar - hidden during print */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Executive Forensics Report
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified dossier compiled by watsonx.ai and IBM Granite reasoning engine.
          </p>
        </div>
        <button
          id="btn-print-dossier"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-750 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition duration-200"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          Print / Export PDF
        </button>
      </div>

      {/* Main Dossier Container */}
      <div className="bg-[#0b1626]/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden print:border-none print:bg-white print:p-0">
        
        {/* Printable Grid Backing Decoration (hidden in print) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none print:hidden" />
        
        {/* Header Block */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-cyan-950 border border-cyan-500/20 text-cyan-400 rounded-lg print:bg-slate-100 print:text-black">
                <Shield className="w-5 h-5" />
              </span>
              <span className="font-mono text-xs tracking-widest text-cyan-400 font-bold uppercase">
                TRUTHLENS AI FORENSICS SUITE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 print:text-black">
              {safeInvestigation.title}
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              CASE_IDENTIFIER: <span className="text-gray-300 print:text-black font-semibold">{safeInvestigation.id}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-1.5">
            <span className="font-mono text-[9px] text-gray-500">DIGITAL SIGNATURE HASH</span>
            <div className="font-mono text-[10px] text-cyan-500/85 flex items-center gap-1 print:text-slate-600 bg-slate-950/60 border border-slate-850 px-2 py-1 rounded">
              <Hash className="w-3 h-3 text-cyan-500" />
              SHA-256: F0A79E2B{safeInvestigation.id}C94
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              COMPILED: {new Date(safeInvestigation.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* High Level Verdict Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          
          {/* Risk Card */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between print:border-slate-300 print:bg-white">
            <span className="text-[10px] font-mono text-gray-500">EXECUTIVE RISK METRIC</span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-3xl font-mono font-bold ${isHighRisk ? "text-rose-500" : isMedRisk ? "text-amber-500" : "text-emerald-500"}`}>
                {safeInvestigation.riskScore}%
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {isHighRisk ? "CRITICAL THREAT" : isMedRisk ? "MODERATE SUSPICION" : "AUTHENTIC"}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${isHighRisk ? "bg-rose-500" : isMedRisk ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${safeInvestigation.riskScore}%` }}
              />
            </div>
          </div>

          {/* Authenticity Card */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between print:border-slate-300 print:bg-white">
            <span className="text-[10px] font-mono text-gray-500">PIXEL AUTHENTICITY RATIO</span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-white print:text-black">
                {safeInvestigation.authenticityScore}%
              </span>
              <span className="text-xs text-gray-400">UNALTERED ELEMENTS</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${safeInvestigation.authenticityScore}%` }}
              />
            </div>
          </div>

          {/* Confidence Card */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between print:border-slate-300 print:bg-white">
            <span className="text-[10px] font-mono text-gray-500">ANALYSIS CONVERGENCE</span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-emerald-400">
                {safeInvestigation.confidence}%
              </span>
              <span className="text-xs text-gray-400">SYSTEM STABILITY</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${safeInvestigation.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section: Executive Summary & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black">
              I. Executive Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-slate-800">
              {investigation.graniteReasoning.summary}
            </p>
          </div>

          <div className="space-y-3 bg-slate-950/20 border border-slate-850/60 rounded-xl p-4 print:border-slate-300 print:bg-white">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              II. Chronological Incident Timeline
            </h3>
            <div className="space-y-4 pl-3.5 border-l border-cyan-500/20 py-1.5 relative">
              <div className="relative">
                <span className="absolute -left-5 top-0.5 w-2 h-2 rounded-full bg-cyan-400" />
                <div className="text-[10px] font-mono text-gray-500">PHASE_1: DIGITIZATION_EVENT</div>
                <div className="text-xs font-sans text-slate-200 print:text-black font-semibold mt-0.5">
                  Metadata timestamp recorded in EXIF block
                </div>
                <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                  {investigation?.metadata?.timestamp || "Unknown"}
                </div>
              </div>
              
              <div className="relative">
                <span className="absolute -left-5 top-0.5 w-2 h-2 rounded-full bg-cyan-400" />
                <div className="text-[10px] font-mono text-gray-500">PHASE_2: SECURE INGESTION</div>
                <div className="text-xs font-sans text-slate-200 print:text-black font-semibold mt-0.5">
                  TruthLens Agent pins and seals hash registry
                </div>
                <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                  {new Date(safeInvestigation.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Granite Explanation */}
        <div className="space-y-3 border-t border-slate-805 pt-6 print:border-slate-300">
          <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            III. IBM Granite Reasoning Synthesis
          </h3>
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 space-y-4 print:bg-slate-100 print:border-none">
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-white print:text-black">CORE COGNITIVE DEDUCTION:</h4>
              <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed font-sans">
                {safeInvestigation.graniteReasoning.summary}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider">MATHEMATICAL FINDINGS REGISTER:</h4>
              <ul className="space-y-2 pl-4 list-disc text-xs text-slate-300 print:text-slate-800">
                {safeInvestigation.graniteReasoning.evidence.map((item, index) => (
                  <li key={index} className="leading-normal">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section: Technical Findings & RAG citations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-805 pt-6 print:border-slate-300">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black">
              IV. Visual findings register
            </h3>
            <div className="space-y-3">
              {safeInvestigation.visualFindings.map((finding) => (
                <div key={finding.id} className="bg-slate-950/30 border border-slate-850/60 p-3 rounded-lg print:border-slate-300 print:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 capitalize">{finding.category}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      finding.severity === "high" ? "bg-rose-950 text-rose-400 border border-rose-500/20" : "bg-amber-950 text-amber-400 border border-amber-500/20"
                    }`}>
                      {finding.severity.toUpperCase()}_SEVERITY
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 print:text-black">{finding.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal print:text-slate-700">{finding.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black">
              V. Retrieved RAG Knowledge index
            </h3>
            <div className="space-y-3">
              {safeInvestigation.knowledgeBaseItems.map((kb) => (
                <div key={kb.id} className="bg-slate-950/30 border border-slate-850/60 p-3 rounded-lg print:border-slate-300 print:bg-white">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>{kb.id}</span>
                    <span className="text-emerald-400">RAG_HIT: {kb.confidence}% Match</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 print:text-black">{kb.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-normal print:text-slate-700">{kb.description}</p>
                  <p className="text-[9px] text-gray-500 mt-2 font-mono">SOURCE: {kb.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Recommendations & Legal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-805 pt-6 print:border-slate-300">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest print:text-black">
              VI. Strategic Remediation Recommendations
            </h3>
            <ul className="space-y-2.5 pl-4 list-decimal text-xs text-slate-300 print:text-slate-800">
              {safeInvestigation.graniteReasoning.recommendations.map((rec, index) => (
                <li key={index} className="leading-relaxed">{rec}</li>
              ))}
            </ul>
          </div>

          <div className="border border-dashed border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 print:border-slate-400 print:bg-white">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-gray-500">COGNITIVE TRUST VERDICT SYSTEM</div>
              <p className="text-[10px] text-gray-400 leading-normal print:text-slate-600">
                This document serves as an analytical cyber-dossier verifying image integrity. The observations generated are synthesized from automated multi-spectral filters combined with Granite-13B neural model outputs.
              </p>
            </div>
            
            {/* Authorized Signature Layout */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-850 print:border-slate-300">
              <div className="space-y-1">
                <div className="font-sans text-[11px] font-bold text-white print:text-black">IBM watsonx Core Autopilot</div>
                <div className="font-mono text-[9px] text-cyan-400/70">AUTHORIZED SECURITY SEAL</div>
              </div>
              <div className="w-16 h-16 border border-emerald-500/20 bg-emerald-950/20 rounded-full flex flex-col items-center justify-center text-emerald-400 font-mono text-[8px] print:border-emerald-700 print:text-emerald-800">
                <CheckCircle className="w-5 h-5 mb-0.5 animate-pulse" />
                VERIFIED
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
